/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 Latitude of the first point in degrees
 * @param lon1 Longitude of the first point in degrees
 * @param lat2 Latitude of the second point in degrees
 * @param lon2 Longitude of the second point in degrees
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Calculate a destination point given a starting point, bearing, and distance
 * Uses the great circle calculation for accuracy
 * @param lat Starting latitude in degrees
 * @param lon Starting longitude in degrees
 * @param bearing Bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 * @param distance Distance in kilometers
 * @returns Destination point as {lat, lon}
 */
export function getDestinationPoint(
  lat: number,
  lon: number,
  bearing: number,
  distance: number
): { lat: number; lng: number } {
  // Earth's radius in kilometers
  const R = 6371

  // Convert to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const lat1 = toRad(lat)
  const lon1 = toRad(lon)
  const bearingRad = toRad(bearing)

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRad)
  )

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
    )

  return {
    lat: toDeg(lat2),
    lng: toDeg(lon2),
  }
}
