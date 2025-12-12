import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { analyzeAnimalImage } from '@/lib/ai';
import { getAllNGOs } from '@/lib/ngos';
import { findNearestNGO } from '@/lib/geo';
import { triggerKestraWorkflow } from '@/lib/kestra';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);

    if (!imageFile || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: image, latitude, longitude' },
        { status: 400 }
      );
    }

    // Upload image to Supabase Storage
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('animal-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from('animal-images')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Convert image to Base64 for AI analysis
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    console.log('base64Image: ', base64Image);

    // Analyze image with AI
    const aiResult = await analyzeAnimalImage(base64Image);

    // Fetch all NGOs
    const ngoList = await getAllNGOs();

    // Find nearest NGO
    const nearestNGO = findNearestNGO(latitude, longitude, ngoList);

    if (!nearestNGO) {
      return NextResponse.json(
        { error: 'No NGO found within service radius' },
        { status: 404 }
      );
    }

    // Parse severity as integer
    const severity = parseInt(aiResult.severity) || 3;

    // Create alert record in database
    const { data: alertData, error: alertError } = await supabase
      .from('alerts')
      .insert({
        image_url: imageUrl,
        animal_type: aiResult.animal_type,
        injury_location: aiResult.injury_location,
        severity: severity,
        latitude: latitude,
        longitude: longitude,
        status: 'pending',
        nearest_ngo_id: nearestNGO.id,
        kestra_execution_id: null
      })
      .select()
      .single();

    if (alertError) {
      console.error('Alert creation error:', alertError);
      return NextResponse.json(
        { error: 'Failed to create alert' },
        { status: 500 }
      );
    }

    // Trigger Kestra workflow
    try {
      const kestraResult = await triggerKestraWorkflow(alertData.id, {
        animalType: aiResult.animal_type,
        injuryLocation: aiResult.injury_location,
        severity: severity,
        ngoEmail: nearestNGO.email,
        imageUrl: imageUrl,
        latitude: latitude,
        longitude: longitude
      });

      // Update alert with Kestra execution ID and status
      await supabase
        .from('alerts')
        .update({
          kestra_execution_id: kestraResult.executionId,
          status: 'notified'
        })
        .eq('id', alertData.id);
    } catch (kestraError) {
      console.error('Kestra workflow error:', kestraError);
      // Continue even if Kestra fails - alert is still created
    }

    return NextResponse.json({
      alertId: alertData.id,
      status: 'notified'
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
