import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Twitter } from "lucide-react";

export default function NewLeadership() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const leaders = [
    {
      name: "Mr. Ruhul Amin",
      role: "Vice President - Marketing",
      bio: "Excellence is not just our standard; it's our unwavering commitment to every stakeholder we serve.",
      image: "/images/persons/ruhul-amin-vice-president-marketing.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Mr. Badrul Amin",
      role: "Vice President - Finance",
      bio: "Innovation drives our success, but our people are the heart of everything we accomplish.",
      image: "/images/persons/badrul-amin-vice-president-finance.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Mr. Khairul Amin",
      role: "Vice President - Administration",
      bio: "Excellence in administration is the foundation of our operational success and growth.",
      image: "/images/persons/khairul-amin-vice-president-administration.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Mr. Ahmed Arfin Amin",
      role: "General Manager",
      bio: "Excellence in administration is the foundation of our operational success and growth.",
      image: "/images/persons/ahmed-arfin-amin-manager.png",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Leadership
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the visionary leaders who guide our group's strategic direction and drive 
            innovation across all business divisions.
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 mb-16">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full rounded-full object-cover shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 group-hover:opacity-0 transition-opacity duration-300" />
                  </div>
                  
                  {/* Social Links */}
                  <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={leader.linkedin}
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={leader.twitter}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {leader.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-4">{leader.role}</div>
                  <p className="text-gray-600 leading-relaxed">{leader.bio}</p>
                </div>

                {/* Decorative Element */}
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leadership Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-semibold text-gray-900 mb-6">Our Leadership Philosophy</h3>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            "We believe in empowering our teams, fostering innovation, and making decisions that create 
            lasting value for all stakeholders. Our leadership approach combines strategic vision with 
            operational excellence, ensuring sustainable growth and positive impact."
          </p>
          <div className="text-lg text-gray-500 italic">- Ahmed Amin, Chairman & CEO</div>
        </motion.div>
      </div>
    </div>
  );
}
