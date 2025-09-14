import { useEffect, useRef } from "react";

const BusinessAssociates = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const associates = [
    {
      name: "Lubrizol",
      description: "Global specialty chemical company",
      industry: "Chemicals",
      logo: "/images/partners/lubrizol.jpg"
    },
    {
      name: "Oren",
      description: "International business solutions",
      industry: "Business Services",
      logo: "/images/partners/oren.jpg"
    },
    {
      name: "Sodexho",
      description: "Global food services and facilities management",
      industry: "Facilities Management",
      logo: "/images/partners/sodexho.png"
    },
    {
      name: "Godrej",
      description: "Indian multinational conglomerate",
      industry: "Consumer Goods",
      logo: "/images/partners/godrej.gif"
    },
    {
      name: "Oil India",
      description: "Leading oil and gas exploration company",
      industry: "Energy",
      logo: "/images/partners/oil-india.png"
    },
    {
      name: "Lalship",
      description: "Maritime and shipping solutions",
      industry: "Logistics",
      logo: "/images/partners/lalship.jpg"
    }
  ];

  // Duplicate the array for seamless scrolling
  const duplicatedAssociates = [...associates, ...associates];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

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
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Global Network
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Business
            <span className="text-primary block mt-2">Associates</span>
          </h2>
          
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Strategic partnerships with world-renowned companies, 
            expanding our global reach and enhancing our capabilities.
          </p>
        </div>

        {/* Scrolling Marquee */}
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
            {duplicatedAssociates.map((associate, index) => (
              <div
                key={`${associate.name}-${index}`}
                className="flex-shrink-0 glass p-8 rounded-2xl min-w-[320px] hover:shadow-glow transition-all duration-500 group cursor-pointer"
              >
                {/* Company Logo */}
                <div className="w-full h-20 bg-primary/10 rounded-xl mb-6 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 relative overflow-hidden">
                  <img
                    src={associate.logo}
                    alt={`${associate.name} logo`}
                    className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="font-display text-2xl font-bold text-primary">${associate.name}</span>`;
                      }
                    }}
                  />
                </div>
                
                {/* Company Info */}
                <div className="text-center">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {associate.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {associate.description}
                  </p>
                  
                  <div className="inline-block px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-secondary-foreground">
                    {associate.industry}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-16">
          <div className="glass p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Partner With Us
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our network of distinguished global partners and help us build 
              innovative solutions that drive progress across industries.
            </p>
            <button className="px-8 py-4 gradient-primary rounded-xl font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              Explore Partnership Opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessAssociates;