interface Company {
  name: string;
  city: string;
  lat: number;
  lon: number;
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const orderCompaniesByDistance = (companies: Company[]): Company[] => {
  const REFERENCE_LAT = 47.2629133;
  const REFERENCE_LON = -1.4844803;
  
  const result: Company[] = [];
  const remaining = [...companies];
  
  // Première entreprise (plus proche du point de référence)
  let currentLat = REFERENCE_LAT;
  let currentLon = REFERENCE_LON;
  
  while (remaining.length > 0) {
    let minDistance = Infinity;
    let closestIndex = 0;
    
    remaining.forEach((company, index) => {
      const distance = calculateDistance(currentLat, currentLon, company.lat, company.lon);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    const closest = remaining[closestIndex];
    result.push(closest);
    remaining.splice(closestIndex, 1);
    
    currentLat = closest.lat;
    currentLon = closest.lon;
  }
  
  return result;
};