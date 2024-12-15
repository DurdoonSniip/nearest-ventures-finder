interface CompanyResult {
  name: string;
  city: string;
  lat: number;
  lon: number;
  distanceFromPrevious?: number;
}

export const saveResults = (results: CompanyResult[]) => {
  localStorage.setItem('companyResults', JSON.stringify(results));
};

export const getResults = (): CompanyResult[] => {
  const saved = localStorage.getItem('companyResults');
  return saved ? JSON.parse(saved) : [];
};