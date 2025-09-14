import { Quote, Award, Building2, Globe, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const BoardOfDirectors = () => {
  const directors = [
    {
      name: "Mr. Ruhul Amin",
      position: "Vice President - Marketing",
      image: "/images/persons/ruhul-amin-vice-president-marketing.jpg",
      quote: "Excellence is not just our standard; it's our unwavering commitment to every stakeholder we serve.",
      achievements: ["15+ Years Marketing Leadership", "Brand Development Expert", "Market Expansion Specialist"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Mr. Badrul Amin",
      position: "Vice President - Finance",
      image: "/images/persons/badrul-amin-vice-president-finance.jpg",
      quote: "Innovation drives our success, but our people are the heart of everything we accomplish.",
      achievements: ["Strategic Finance Expert", "20+ Years Financial Leadership", "Growth & Investment Specialist"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Mr. Khairul Amin",
      position: "Vice President - Administration",
      image: "/images/persons/khairul-amin-vice-president-administration.jpg",
      quote: "Excellence in administration is the foundation of our operational success and growth.",
      achievements: ["Administrative Excellence", "15+ Years Operations Leadership", "Process Optimization Expert"],
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Mr. Ahmed Arfin Amin",
      position: "General Manager",
      image: "/images/persons/ahmed-arfin-amin-manager.png",
      quote: "Excellence in administration is the foundation of our operational success and growth.",
      achievements: ["General Manager", "15+ Years Operations Leadership", "Process Optimization Expert"],
      social: { linkedin: "#", twitter: "#" }
    }
    
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Exclusive Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-[1px] bg-primary"></div>
            <Award className="h-6 w-6 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Board of Directors
            </span>
            <Award className="h-6 w-6 text-primary" />
            <div className="w-12 h-[1px] bg-primary"></div>
          </div>
          
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Visionary
            <span className="text-primary block mt-2">Leadership</span>
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-[1px] bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary shadow-glow"></div>
            <div className="w-24 h-[1px] bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary shadow-glow"></div>
            <div className="w-16 h-[1px] bg-primary"></div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Meet the extraordinary leaders who guide Ahmed Amin Group's strategic vision, 
            driving innovation and excellence across our diverse portfolio of industries.
          </p>
        </div>

        {/* Premium Directors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {directors.map((director, index) => (
            <div
              key={director.name}
              className={`group relative fade-in-up stagger-${index + 1}`}
            >
              {/* Luxury Card Container */}
              <div className="glass-premium p-10 rounded-3xl relative overflow-hidden hover:shadow-luxury transition-all duration-700 hover:-translate-y-3">
                {/* Premium Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Director Portrait */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto relative">
                    {/* Golden Frame */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 group-hover:border-primary group-hover:shadow-glow transition-all duration-500"></div>
                    {/* Inner Frame */}
                    <div className="absolute inset-2 rounded-xl border border-primary/20 group-hover:border-primary/60 transition-all duration-500"></div>
                    {/* Portrait */}
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-28 h-28 rounded-xl object-cover mx-auto mt-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                </div>

                {/* Director Information */}
                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {director.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-lg">
                    {director.position}
                  </p>
                  
                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="h-6 w-6 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground italic leading-relaxed text-sm">
                      "{director.quote}"
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-3 mb-8">
                  <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider text-center">
                    Key Achievements
                  </h4>
                  <div className="space-y-2">
                    {director.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow"></div>
                        <span className="text-muted-foreground text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Excellence CTA */}
        <div className="text-center">
          <div className="glass-premium p-12 rounded-3xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Building2 className="h-8 w-8 text-primary" />
                <Globe className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Leading with Excellence & Vision
              </h3>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Our board combines decades of industry expertise with forward-thinking leadership, 
                ensuring Ahmed Amin Group remains at the forefront of industrial innovation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                >
                  Meet Our Leadership Team
                  <Award className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                >
                  Corporate Governance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectors;