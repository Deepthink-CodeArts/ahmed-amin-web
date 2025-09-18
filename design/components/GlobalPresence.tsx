import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Globe, Users, Building } from "lucide-react";

export default function GlobalPresence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    {
      id: 'all',
      name: 'Global Overview',
      countries: 25,
      employees: 15000,
      offices: 85,
      description: 'Our worldwide presence spans across all major continents'
    },
    {
      id: 'middle-east',
      name: 'Middle East & Africa',
      countries: 12,
      employees: 8500,
      offices: 35,
      description: 'Our home region where we continue to expand and innovate'
    },
    {
      id: 'asia',
      name: 'Asia Pacific',
      countries: 8,
      employees: 4200,
      offices: 28,
      description: 'Rapid growth in emerging markets across Asia'
    },
    {
      id: 'europe',
      name: 'Europe',
      countries: 3,
      employees: 1800,
      offices: 15,
      description: 'Strategic partnerships and premium services'
    },
    {
      id: 'americas',
      name: 'Americas',
      countries: 2,
      employees: 500,
      offices: 7,
      description: 'Expanding presence in North and South America'
    }
  ];

  const offices = [
    { city: "Dubai", country: "UAE", role: "Global Headquarters", employees: 2500 },
    { city: "Cairo", country: "Egypt", role: "Regional Hub", employees: 1800 },
    { city: "Riyadh", country: "Saudi Arabia", role: "Regional Office", employees: 1200 },
    { city: "Singapore", country: "Singapore", role: "Asia Pacific Hub", employees: 800 },
    { city: "London", country: "UK", role: "European Office", employees: 600 },
    { city: "Mumbai", country: "India", role: "Technology Center", employees: 1500 },
  ];

  return (
    <div className="py-24 bg-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Global
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Footprint
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            With operations spanning 25+ countries, we bring local expertise and global perspective 
            to every market we serve.
          </p>
        </motion.div>

        {/* Interactive Map Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8"
          >
            {/* World Map Placeholder */}
            <div className="relative h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1597149962419-0d90ac2e3db4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="World map"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Office Markers */}
              {offices.map((office, index) => (
                <motion.div
                  key={office.city}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${15 + index * 15}%`,
                    top: `${20 + (index % 3) * 20}%`
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="bg-white rounded-full p-3 shadow-lg border-2 border-blue-200 cursor-pointer"
                  >
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 shadow-lg border border-gray-200 text-sm whitespace-nowrap">
                    <div className="font-semibold">{office.city}</div>
                    <div className="text-gray-600">{office.employees} employees</div>
                  </div>
                </motion.div>
              ))}

              <div className="text-center text-gray-600">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-semibold mb-2">Our Global Network</h3>
                <p>Click on the markers to explore our offices worldwide</p>
              </div>
            </div>
          </motion.div>

 