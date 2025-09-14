import HeroSection from "@/components/home/HeroSection";
import AboutIntro from "@/components/home/AboutIntro";
import SubsidiariesShowcase from "@/components/home/SubsidiariesShowcase";
import BusinessAssociates from "@/components/home/BusinessAssociates";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutIntro />
      <SubsidiariesShowcase />
      <BoardOfDirectors />
      <BusinessAssociates />
    </main>
  );
};

export default Index;
