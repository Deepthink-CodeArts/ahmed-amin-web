import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Globe, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Iridescence from "@/components/ui/Iridescence";
import ShinyText from "@/components/ui/ShinyText";

export default function NewHeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
      {/* Iridescence Background */}
      <Iridescence
        color={[0.2, 0.4, 0.8]}
        mouseReact={true}
        amplitude={0.2}
        speed={0.8}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="text-center max-w-6xl mx-auto px-6 z-10"
      >
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            <ShinyText text="Better Future" speed={3} className="text-white" />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold relative">
              {" "}Together
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </span>
          </h1>
          {/* <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed">
            A diversified group of companies driving innovation across industries, 
            creating sustainable value for communities worldwide
          </h2> */}
        </motion.div>

        {/* Subsidiaries Rolling Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-lg sm:text-xl text-white/90 font-medium mb-4">Our Subsidiary Companies</h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            
            {/* Rolling Gallery Container */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll space-x-8 py-4">
                {/* First set of logos */}
                {[
                  { name: "Baraka Limited", logo: "/images/subsidiaries/BCPL.png" },
                  { name: "Business Development Corporation Ltd", logo: "/images/subsidiaries/bdcl.png" },
                  { name: "Baraka Engineers Limited", logo: "/images/subsidiaries/baraka-engineers-construction.png" },
                  { name: "Business Information Technology Limited", logo: "/images/subsidiaries/BITL.png" },
                  { name: "BARAKA Renewable Energy Ltd", logo: "/images/subsidiaries/BREL.png" },
                  { name: "BARAKA Waste Management Ltd", logo: "/images/subsidiaries/BWML.png" }
                ].map((company, index) => (
                  <div
                    key={`first-${company.name}`}
                    className="flex-shrink-0 flex items-center justify-center w-32 h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-w-24 max-h-16 object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="text-white/70 text-xs font-medium text-center px-2">${company.name.split(' ')[0]}</div>`;
                        }
                      }}
                    />
                  </div>
                ))}
                
                {/* Duplicate set for seamless scrolling */}
                {[
                  { name: "Baraka Limited", logo: "/images/subsidiaries/BCPL.png" },
                  { name: "Business Development Corporation Ltd", logo: "/images/subsidiaries/bdcl.png" },
                  { name: "Baraka Engineers Limited", logo: "/images/subsidiaries/baraka-engineers-construction.png" },
                  { name: "Business Information Technology Limited", logo: "/images/subsidiaries/BITL.png" },
                  { name: "BARAKA Renewable Energy Ltd", logo: "/images/subsidiaries/BREL.png" },
                  { name: "BARAKA Waste Management Ltd", logo: "/images/subsidiaries/BWML.png" }
                ].map((company, index) => (
                  <div
                    key={`second-${company.name}`}
                    className="flex-shrink-0 flex items-center justify-center w-32 h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-w-24 max-h-16 object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="text-white/70 text-xs font-medium text-center px-2">${company.name.split(' ')[0]}</div>`;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Explore Our Companies
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 hover:border-blue-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full hover:bg-blue-50 transition-all duration-300"
          >
            Our Story
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-sm text-white/80 mb-4 font-medium">Discover More</div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-1 h-3 bg-white/80 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

    </div>
  );
}
