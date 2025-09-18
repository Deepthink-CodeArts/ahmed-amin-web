import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const NewBusinessAssociates = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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
    <div className="py-24 bg-gray-100 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Business
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Associates
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Strategic partnerships with world-renowned companies, 
            expanding our global reach and enhancing our capabilities.
          </p>
        </motion.div>

        {/* Scrolling Marquee */}
        <div className="relative mb-16">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-16 sm:w-24 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-16 sm:w-24 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex space-x-4 sm:space-x-6 overflow-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedAssociates.map((associate, index) => (
              <motion.div
                key={`${associate.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 bg-white p-4 sm:p-6 rounded-2xl min-w-[280px] sm:min-w-[320px] hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100"
              >
                {/* Company Logo */}
                <div className="w-full h-16 sm:h-20 bg-blue-50 rounded-xl mb-4 sm:mb-6 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
                  <img
                    src={associate.logo}
                    alt={`${associate.name} logo`}
                    className="max-h-12 sm:max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="font-display text-lg sm:text-xl font-bold text-blue-600">${associate.name}</span>`;
                      }
                    }}
                  />
                </div>
                
                {/* Company Info */}
                <div className="text-center">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {associate.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {associate.description}
                  </p>
                  
                  <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {associate.industry}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Partner With Us
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join our network of distinguished global partners and help us build 
              innovative solutions that drive progress across industries.
            </p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Explore Partnership Opportunities
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewBusinessAssociates;
