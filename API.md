# A.R.A.S API Documentation

## Overview

The A.R.A.S (Animal Rescue Alert System) provides REST API endpoints for uploading animal rescue alerts and triggering workflows.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.vercel.app
```

## Endpoints

### 1. Upload Animal Image

**POST** `/api/upload-image`

Upload an animal image with location data for AI analysis and NGO notification.

#### Request

**Content-Type**: `multipart/form-data`

**Body Parameters**:
- `image` (File, required): Image file of the injured animal
- `latitude` (string, required): GPS latitude coordinate
- `longitude` (string, required): GPS longitude coordinate

#### Example Request

```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('latitude', '28.6139');
formData.append('longitude', '77.2090');

const response = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData
});
```

#### Success Response

**Status**: `200 OK`

```json
{
  "alertId": "uuid-string",
  "status": "notified"
}
```

#### Error Responses

**Status**: `400 Bad Request`
```json
{
  "error": "Missing required fields: image, latitude, longitude"
}
```

**Status**: `404 Not Found`
```json
{
  "error": "No NGO found within service radius"
}
```

**Status**: `500 Internal Server Error`
```json
{
  "error": "Failed to upload image"
}
```

---

### 2. Trigger Kestra Workflow

**POST** `/api/trigger-kestra`

Manually trigger a Kestra workflow for an alert (typically called automatically).

#### Request

**Content-Type**: `application/json`

**Body Parameters**:
```json
{
  "alertId": "string (required)",
  "animalType": "string (required)",
  "injuryLocation": "string (required)",
  "severity": "number (required, 1-5)",
  "ngoEmail": "string (required)",
  "imageUrl": "string (required)",
  "latitude": "number (required)",
  "longitude": "number (required)"
}
```

#### Example Request

```javascript
const response = await fetch('/api/trigger-kestra', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    alertId: "123e4567-e89b-12d3-a456-426614174000",
    animalType: "Dog",
    injuryLocation: "Front left leg",
    severity: 3,
    ngoEmail: "contact@ngo.org",
    imageUrl: "https://example.com/image.jpg",
    latitude: 28.6139,
    longitude: 77.2090
  })
});
```

#### Success Response

**Status**: `200 OK`

```json
{
  "success": true,
  "executionId": "kestra-execution-id"
}
```

#### Error Responses

**Status**: `400 Bad Request`
```json
{
  "error": "Missing required fields"
}
```

**Status**: `500 Internal Server Error`
```json
{
  "error": "Failed to trigger workflow"
}
```

---

## Database Schema

### NGOs Table

```sql
CREATE TABLE ngos (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  radius_km INT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### Alerts Table

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  image_url TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  injury_location TEXT NOT NULL,
  severity INT NOT NULL CHECK (severity >= 1 AND severity <= 5),
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','notified','in_progress','resolved')),
  nearest_ngo_id UUID REFERENCES ngos(id),
  kestra_execution_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## AI Analysis

The system uses OpenAI's GPT-4o Vision model to analyze uploaded images.

### Input

Base64-encoded image with the following prompt:

```
Analyze the image of an injured animal. Return JSON ONLY:

{
 "animal_type": "",
 "injury_location": "",
 "severity": "",
 "description": ""
}
```

### Output

```json
{
  "animal_type": "Dog",
  "injury_location": "Front left leg",
  "severity": "3",
  "description": "Visible wound on the front left leg with moderate bleeding"
}
```

---

## Geolocation

### Haversine Distance Calculation

The system calculates the distance between the user's location and NGOs using the Haversine formula:

```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

### NGO Selection

The system finds the nearest NGO where:
- Distance from user to NGO ≤ NGO's `radius_km`
- If multiple NGOs are within range, the closest one is selected

---

## Kestra Workflow

### Workflow Structure

```yaml
id: rescue-workflow
namespace: aras.rescue

inputs:
  - alertId (STRING)
  - animalType (STRING)
  - injuryLocation (STRING)
  - severity (INT)
  - ngoEmail (STRING)
  - imageUrl (STRING)
  - latitude (DOUBLE)
  - longitude (DOUBLE)

tasks:
  1. AI Summary Generation
  2. Email Notification via Resend
```

### Email Template

The workflow sends an HTML email with:
- Subject: "URGENT: Injured {animalType} Found"
- Animal type
- Injury location
- Severity level
- GPS coordinates
- Animal photo

---

## Rate Limiting

**Recommended for Production**:

- Implement rate limiting on API endpoints
- Suggested limit: 10 requests per minute per IP
- Use middleware like `next-rate-limit` or Vercel's edge functions

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request / validation error
- `404` - Resource not found
- `500` - Internal server error

---

## Authentication

**Current Status**: Public API (no authentication required)

**Production Recommendations**:
- Add API key authentication
- Implement user accounts
- Add role-based access control (RBAC)
- Rate limit by authenticated user

---

## CORS Configuration

The API allows requests from:
- Same origin (default)
- Configure CORS in `next.config.ts` for external clients

---

## Storage

### Supabase Storage

- Bucket: `animal-images`
- Access: Public read, authenticated write
- File naming: `{timestamp}-{original-filename}`
- Supported formats: JPEG, PNG, WebP

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
KESTRA_URL
KESTRA_API_KEY
NEXT_PUBLIC_SITE_URL
```

---

## Testing

### Test Image Upload

```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "image=@test-image.jpg" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090"
```

### Test Kestra Trigger

```bash
curl -X POST http://localhost:3000/api/trigger-kestra \
  -H "Content-Type: application/json" \
  -d '{
    "alertId": "test-id",
    "animalType": "Dog",
    "injuryLocation": "Leg",
    "severity": 3,
    "ngoEmail": "test@example.com",
    "imageUrl": "https://example.com/image.jpg",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

---

## Version

**Current Version**: 0.1.0

**API Version**: v1 (implicit in current routes)

---

## Support

For API issues:
1. Check environment variables
2. Review server logs
3. Verify Supabase connection
4. Test OpenAI API key
5. Confirm Kestra workflow is deployed
