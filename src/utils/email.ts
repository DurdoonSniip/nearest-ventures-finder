import emailjs from '@emailjs/browser';

interface CompanyResult {
  name: string;
  city: string;
  lat: number;
  lon: number;
  distanceFromPrevious?: number;
}

export const sendResultsByEmail = async (email: string, results: CompanyResult[]) => {
  const wazeLinks = results.map(company => 
    `https://www.waze.com/ul?ll=${company.lat}%2C${company.lon}&navigate=yes&zoom=17`
  );
  
  const resultsHTML = results.map((company, index) => `
    ${index + 1}. ${company.name} (${company.city})
    ${company.distanceFromPrevious ? `Distance: ${company.distanceFromPrevious.toFixed(2)} km` : ''}
    Waze: ${wazeLinks[index]}
    
  `).join('\n');

  const templateParams = {
    to_email: email,
    results: resultsHTML,
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID', // À remplacer par votre Service ID
      'YOUR_TEMPLATE_ID', // À remplacer par votre Template ID
      templateParams,
      'YOUR_PUBLIC_KEY' // À remplacer par votre Public Key
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};