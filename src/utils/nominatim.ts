interface NominatimResponse {
  lat: string;
  lon: string;
}

export const getCoordinates = async (company: string, city: string): Promise<{lat: number, lon: number}> => {
  const query = encodeURIComponent(`${company}, ${city}`);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
  );
  const data = await response.json();
  
  if (data && data[0]) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  }
  throw new Error(`Impossible de trouver les coordonnées pour ${company} à ${city}`);
};