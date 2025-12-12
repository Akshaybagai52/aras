import { NGO } from '@/types/ngo';

/**
 * Calculate distance between two points using Haversine formula
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest NGO within their service radius
 */
export function findNearestNGO(
  userLat: number,
  userLng: number,
  ngoList: NGO[]
): NGO | null {
  let nearestNGO: NGO | null = null;
  let minDistance = Infinity;

  for (const ngo of ngoList) {
    const distance = haversineDistance(userLat, userLng, ngo.latitude, ngo.longitude);

    // Check if within NGO's service radius
    if (distance <= ngo.radius_km && distance < minDistance) {
      minDistance = distance;
      nearestNGO = ngo;
    }
  }

  return nearestNGO;
}
