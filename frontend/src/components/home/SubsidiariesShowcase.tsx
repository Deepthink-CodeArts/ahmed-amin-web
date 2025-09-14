import { useEffect, useRef } from "react";
import { Calendar, ExternalLink } from "lucide-react";

const SubsidiariesShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const subsidiaries = [
    {
      name: "Baraka Limited",
      year: 1998,
      description: "Pioneer company specializing in industrial solutions and manufacturing excellence.",
      sector: "Manufacturing",
      logo: "/images/subsidiaries/BCPL.png"
    },
    {
      name: "Business Development Corporation Ltd",
      year: 1998,
      description: "Strategic business development and corporate consulting services.",
      sector: "Consulting",
      logo: "/images/subsidiaries/bdcl.png"
    },
    {
      name: "Baraka Engineers Limited",
      year: 1999,
      description: "Construction, dredging, pipeline, and concrete block engineering services.",
      sector: "Engineering",
      logo: "/images/subsidiaries/baraka-engineers-construction.png"
    },
    {
      name: "Business Information Technology Limited",
      year: 2001,
      description: "Cutting-edge IT solutions and digital transformation services.",
      sector: "Technology",
      logo: "/images/subsidiaries/BITL.png"
    },
    {
      name: "BARAKA Renewable Energy Ltd",
      year: 2007,
      description: "Sustainable energy solutions and renewable technology implementation.",
      sector: "Renewable Energy",
      logo: "/images/subsidiaries/BREL.png"
    },
    {
      name: "BARAKA Waste Management Ltd",
      year: 2007,
      description: "Environmental solutions and comprehensive waste management services.",
      sector: "Environment",
      logo: "/images/subsidiaries/BWML.png"
    }
  ];

  // Duplicate the array for seamless scrolling
  const duplicatedSubsidiaries = [...subsidiaries, ...subsidiaries];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Slightly slower than BusinessAssociates for better readability

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through one full set
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="py-32 bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Elegant Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-[1px] bg-primary"></div>
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Portfolio
            </span>
            <div className="w-12 h-[1px] bg-primary"></div>
          </div>
          
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Subsidiary
            <span className="text-primary block mt-2">Companies</span>
          </h2>
          
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A diverse portfolio of companies driving innovation and excellence 
            across multiple industries, each contributing to our collective vision 
            of building a better future together.
          </p>
        </div>

        {/* Scrolling Carousel */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
          
          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex space-x-8 overflow-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedSubsidiaries.map((subsidiary, index) => (
              <div
                key={`${subsidiary.name}-${index}`}
                className="flex-shrink-0 glass-premium p-8 rounded-3xl min-w-[380px] hover:shadow-luxury transition-all duration-700 group cursor-pointer relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Logo Section */}
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <div className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <img
                          src={subsidiary.logo}
                          alt={`${subsidiary.name} logo`}
                          className="max-w-16 max-h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-2xl font-bold text-primary">${subsidiary.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {subsidiary.name}
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-primary font-semibold text-sm">{subsidiary.year}</span>
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4">
                      {subsidiary.sector}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {subsidiary.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-center">
                    <button className="flex items-center space-x-2 text-primary font-semibold hover:text-primary-glow transition-colors duration-300 group/btn">
                      <span>Learn More</span>
                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/20 group-hover:border-primary transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <div className="glass p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Explore Our Companies
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the full scope of our subsidiary companies and their 
              contributions to various industries across the global market.
            </p>
            <button className="px-8 py-4 gradient-primary rounded-xl font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              View All Companies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiariesShowcase;