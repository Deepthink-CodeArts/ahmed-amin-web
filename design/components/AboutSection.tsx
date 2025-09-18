import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, Heart, Target } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We conduct business with the highest ethical standards, building trust through transparency and accountability."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, continuously improving and innovating to exceed expectations."
    },
    {
      icon: Heart,
      title: "Community",
      description: "We are committed to creating positive impact in the communities where we operate, fostering growth and development."
    },
    {
      icon: Target,
      title: "Vision",
      description: "We focus on long-term sustainable growth, making strategic decisions that benefit all stakeholders."
    }
  ];

  return (
    <div className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Our 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Legacy
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For over three decades, Ahmed Amin Group has been at the forefront of business innovation, 
            building a diverse portfolio of companies that shape industries and transform communities.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">Building Tomorrow, Today</h3>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in 1993, Ahmed Amin Group began as a visionary enterprise with a simple yet powerful mission: 
                to create businesses that not only generate value but also contribute meaningfully to society.
              </p>
              <p>
                What started as a single company has evolved into a dynamic conglomerate spanning multiple industries, 
                from technology and healthcare to real estate and manufacturing. Our growth story is one of strategic 
                expansion, careful diversification, and unwavering commitment to excellence.
              </p>
              <p>
                Today, we operate across 25+ countries, employing over 15,000 talented individuals who share our 
                commitment to innovation, sustainability, and positive impact.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 h-full flex items-center">
              <div className="w-full">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern office building"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600">1993</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl font-semibold text-gray-900 mb-4">Our Core Values</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide every decision we make and every relationship we build
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <value.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">{value.title}</h4>
              <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}