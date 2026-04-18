// Simple cache for reverse geocoding results to avoid repeated API calls
const geocodeCache = new Map();

/**
 * Reverse geocode using Nominatim (OpenStreetMap) - works anywhere on Earth
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Location name or "Unknown Location"
 */
export const reverseGeocode = async (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return 'Unknown Location';

  // Check cache first
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    // Use Nominatim API (free, no auth required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    // Extract the most relevant location name
    let location = 'Unknown Location';

    if (data.address) {
      // Priority: country > state > city > district
      if (data.address.country) {
        location = data.address.country;
      } else if (data.address.state) {
        location = data.address.state;
      } else if (data.address.city) {
        location = data.address.city;
      } else if (data.address.county) {
        location = data.address.county;
      }
    } else if (data.name) {
      location = data.name;
    }

    // Cache the result
    geocodeCache.set(cacheKey, location);
    return location;
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return 'Unknown Location';
  }
};

/**
 * Synchronous version using hardcoded fallback (for when async isn't available)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Approximate location name
 */
export const findCountryByCoordinates = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  // Simple regions mapping for quick fallback
  const regions = {
    'Antarctica': { lat: -75, coords: [[-90, -180], [-60, 180]] },
    'Arctic Ocean': { lat: 85, coords: [[-60, -180], [90, 180]] },
    'Greenland': { lat: 72, lng: -40 },
    'Australia': { lat: -25, lng: 133 },
    'Oceans': { lat: 0, lng: 0 }, // Generic fallback
  };

  // Very simple check - this runs while async geocoding happens
  if (lat > 75 || lat < -75) return 'Polar Region';
  if (lat > 60 && lat < 72 && lng > -50 && lng < 40) return 'Arctic';
  if (lat < -60) return 'Antarctica';

  return null; // Will use async geocoding instead
};
