import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Cpu, Heart, Home, Factory, Briefcase, Zap } from "lucide-react";

export default function NewBusinessDivisions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const divisions = [
    {
      icon: Cpu,
      title: "Information Technology",
      description: "Cutting-edge software development, AI solutions, and digital transformation services.",
      logo: "/images/subsidiaries/BITL.png",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Factory,
      title: "Manufacturing & Industrial",
      description: "Advanced manufacturing facilities producing high-quality products for global markets.",
      logo: "/images/subsidiaries/BCPL.png",
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50"
    },
    {
      icon: Building2,
      title: "Engineering & Construction",
      description: "Construction, dredging, pipeline, and concrete block engineering services.",
      logo: "/images/subsidiaries/baraka-engineers-construction.png",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Zap,
      title: "Renewable Energy",
      description: "Sustainable energy solutions and renewable technology implementation.",
      logo: "/images/subsidiaries/BREL.png",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      icon: Heart,
      title: "Waste Management",
      description: "Environmental solutions and comprehensive waste management services.",
      logo: "/images/subsidiaries/BWML.png",
      color: "from-green-600 to-teal-600",
      bgColor: "from-green-50 to-teal-50"
    },
    {
      icon: Briefcase,
      title: "Business Development",
      description: "Strategic business development and corporate consulting services.",
      logo: "/images/subsidiaries/bdcl.png",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    }
  ];

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
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Our
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-semibold">
              {" "}Subsidiaries
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A diverse portfolio of specialized companies, each contributing to our collective vision 
            of building a better future through innovation and excellence.
          </p>
        </motion.div>

        {/* Divisions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {divisions.map((division, index) => (
            <motion.div
              key={division.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className={`bg-white rounded-3xl p-8 h-full border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group`}>
                {/* Logo and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${division.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <division.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-20 h-16 flex items-center justify-center">
                    <img
                      src={division.logo}
                      alt={`${division.title} logo`}
                      className="max-w-16 max-h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {division.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {division.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-gray-200"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Our Subsidiaries at a Glance</h3>
            <p className="text-lg text-gray-600">Each subsidiary contributes uniquely to our collective success</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { label: "Active Subsidiaries", value: "6", color: "text-blue-600" },
              { label: "Years Combined", value: "150+", color: "text-green-600" },
              { label: "Industries", value: "6", color: "text-purple-600" },
              { label: "Global Reach", value: "25+", color: "text-orange-600" },
              { label: "Team Members", value: "15K+", color: "text-red-600" },
              { label: "Projects", value: "1000+", color: "text-indigo-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}
