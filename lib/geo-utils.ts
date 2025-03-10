// Haversine formula to calculate distance (in km) between two coordinates
export function calculateHaversineDistance(coords1: [number, number], coords2: [number, number]): number {
    const toRad = (x: number) => (x * Math.PI) / 180
    const [lat1, lon1] = coords1
    const [lat2, lon2] = coords2
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  
  