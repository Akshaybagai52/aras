'use server';

import { redirect } from 'next/navigation';

export async function uploadAnimalImage(formData: FormData) {
  const image = formData.get('image') as File;
  const latitude = formData.get('latitude') as string;
  const longitude = formData.get('longitude') as string;

  if (!image || !latitude || !longitude) {
    throw new Error('Missing required fields');
  }

  // Create new FormData for the API call
  const apiFormData = new FormData();
  apiFormData.append('image', image);
  apiFormData.append('latitude', latitude);
  apiFormData.append('longitude', longitude);

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/upload-image`, {
    method: 'POST',
    body: apiFormData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await response.json();
  
  // Redirect to alert page
  redirect(`/alert/${data.alertId}`);
}
