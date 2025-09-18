import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Cpu, Heart, Home, Factory, Briefcase } from "lucide-react";

export default function BusinessDivisions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const divisions = [
    {
      icon: Cpu,
      title: "Technology Solutions",
      description: "Cutting-edge software development, AI solutions, and digital transformation services.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Heart,
      title: "Healthcare & Life Sciences",
      description: "Advanced medical facilities, pharmaceutical research, and healthcare technology innovations.",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50"
    },
    {
      icon: Home,
      title: "Real Estate Development",
      description: "Premium residential and commercial properties, urban planning, and smart city solutions.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Factory,
      title: "Manufacturing",
      description: "Advanced manufacturing facilities producing high-quality products for global markets.",
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50"
    },
    {
      icon: Briefcase,
      title: "Financial Services",
      description: "Investment management, corporate finance, and innovative fintech solutions.",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      icon: Building2,
      title: "Infrastructure",
      description: "Large-scale infrastructure projects, construction, and engineering excellence.",
      color: "from-gray-600 to-slate-600",
      bgColor: "from-gray-50 to-slate-50"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Business
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Divisions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our diversified portfolio spans multiple industries, each led by experts committed to 
            innovation, quality, and sustainable growth.
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
              <div className={`bg-gradient-to-br ${division.bgColor} rounded-3xl p-8 h-full border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500`}>
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${division.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <division.icon className="w-8 h-8 text-white" />
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

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-gray-100"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">Our Impact by Numbers</h3>
            <p className="text-lg text-gray-600">Measurable results across all our business divisions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Companies", value: "50+", color: "text-blue-600" },
              { label: "Revenue", value: "$2.5B+", color: "text-green-600" },
              { label: "Projects", value: "1000+", color: "text-purple-600" },
              { label: "Awards", value: "150+", color: "text-orange-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
 