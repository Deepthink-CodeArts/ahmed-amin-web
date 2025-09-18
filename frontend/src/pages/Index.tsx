import NewHeroSection from "@/components/home/NewHeroSection";
import NewAboutSection from "@/components/home/NewAboutSection";
import NewBusinessDivision from "@/components/home/NewBusinessDivision";
import NewLeadership from "@/components/home/NewLeadership";
import NewNewsInsights from "@/components/home/NewNewsInsights";
import NewBusinessAssociates from "@/components/home/NewBusinessAssociates";
import NewContactSection from "@/components/home/NewContactSection";
import WaveDivider from "@/components/ui/WaveDivider";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <NewHeroSection />
      <WaveDivider variant="wave3" />
      <NewAboutSection />
      <WaveDivider variant="wave2" />
      <NewBusinessDivision />
      <WaveDivider variant="wave3" />
      <NewLeadership />
      <WaveDivider variant="wave1" />
      <NewNewsInsights />
      <WaveDivider variant="wave2" />
      <NewBusinessAssociates />
      <WaveDivider variant="wave3" />
      <NewContactSection />
      <WaveDivider variant="wave2" />

    </main>
  );
};

export default Index;
