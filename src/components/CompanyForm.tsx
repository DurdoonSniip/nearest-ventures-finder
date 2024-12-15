import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getCoordinates } from '../utils/nominatim';
import { orderCompaniesByDistance, calculateDistance } from '../utils/distance';
import { saveResults } from '../utils/storage';
import { sendResultsByEmail } from '../utils/email';

interface Company {
  name: string;
  city: string;
  lat?: number;
  lon?: number;
}

const CompanyForm = () => {
  const [numCompanies, setNumCompanies] = useState<number>(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumCompaniesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value) || 0;
    setNumCompanies(num);
    setCompanies(Array(num).fill({ name: '', city: '' }));
  };

  const handleCompanyChange = (index: number, field: 'name' | 'city', value: string) => {
    const newCompanies = [...companies];
    newCompanies[index] = { ...newCompanies[index], [field]: value };
    setCompanies(newCompanies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer les coordonnées pour chaque entreprise
      const companiesWithCoords = await Promise.all(
        companies.map(async (company) => {
          const coords = await getCoordinates(company.name, company.city);
          return { ...company, ...coords };
        })
      );

      // Ordonner les entreprises par distance
      const orderedCompanies = orderCompaniesByDistance(companiesWithCoords);

      // Calculer les distances entre les entreprises
      const results = orderedCompanies.map((company, index) => {
        if (index === 0) {
          return company;
        }
        const prevCompany = orderedCompanies[index - 1];
        const distance = calculateDistance(
          prevCompany.lat,
          prevCompany.lon,
          company.lat,
          company.lon
        );
        return { ...company, distanceFromPrevious: distance };
      });

      // Sauvegarder les résultats
      saveResults(results);

      // Envoyer l'email
      await sendResultsByEmail(email, results);

      toast({
        title: "Succès!",
        description: "Les résultats ont été sauvegardés et envoyés par email.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement des données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="numCompanies">Nombre d'entreprises</Label>
        <Input
          id="numCompanies"
          type="number"
          min="0"
          value={numCompanies || ''}
          onChange={handleNumCompaniesChange}
        />
      </div>

      {companies.map((company, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor={`company-${index}`}>Nom de l'entreprise {index + 1}</Label>
            <Input
              id={`company-${index}`}
              value={company.name}
              onChange={(e) => handleCompanyChange(index, 'name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`city-${index}`}>Ville {index + 1}</Label>
            <Input
              id={`city-${index}`}
              value={company.city}
              onChange={(e) => handleCompanyChange(index, 'city', e.target.value)}
              required
            />
          </div>
        </div>
      ))}

      {numCompanies > 0 && (
        <div className="space-y-2">
          <Label htmlFor="email">Email pour recevoir les résultats</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      {numCompanies > 0 && (
        <Button type="submit" disabled={loading}>
          {loading ? "Traitement en cours..." : "Calculer les distances"}
        </Button>
      )}
    </form>
  );
};

export default CompanyForm;