import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Globe, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20">
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
          className="mb-8"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 leading-tight">
            Shaping
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-semibold">
              {" "}Tomorrow
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed">
            A diversified group of companies driving innovation across industries, 
            creating sustainable value for communities worldwide
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
        >
          {[
            { icon: Globe, label: "Global Presence", value: "25+ Countries" },
            { icon: Users, label: "Team Members", value: "15,000+" },
            { icon: TrendingUp, label: "Years of Excellence", value: "30+" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Explore Our Companies
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg rounded-full hover:bg-blue-50 transition-all duration-300"
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
          <div className="text-sm text-gray-500 mb-4 font-medium">Discover More</div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-1/4 right-16 w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20"
      />
    </div>
  );
}