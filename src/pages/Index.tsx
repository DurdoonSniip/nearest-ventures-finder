import CompanyForm from "@/components/CompanyForm";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Calculateur de distances entre entreprises
      </h1>
      <CompanyForm />
    </div>
  );
};

export default Index;