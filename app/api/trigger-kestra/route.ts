import { NextRequest, NextResponse } from 'next/server';
import { triggerKestraWorkflow } from '@/lib/kestra';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      alertId,
      animalType,
      injuryLocation,
      severity,
      ngoEmail,
      imageUrl,
      latitude,
      longitude
    } = body;

    if (!alertId || !animalType || !ngoEmail || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await triggerKestraWorkflow(alertId, {
      animalType,
      injuryLocation,
      severity: parseInt(severity) || 3,
      ngoEmail,
      imageUrl,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    return NextResponse.json({
      success: true,
      executionId: result.executionId
    });
  } catch (error) {
    console.error('Error triggering Kestra:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
