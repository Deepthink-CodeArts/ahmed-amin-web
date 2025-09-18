import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, ArrowUpRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsInsights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const news = [
    {
      category: "Corporate News",
      title: "Ahmed Amin Group Announces Strategic Partnership with Global Tech Leader",
      excerpt: "This partnership will accelerate our digital transformation initiatives across all business divisions.",
      date: "December 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      category: "Sustainability",
      title: "Achieving Carbon Neutrality: Our 2025 Environmental Goals",
      excerpt: "Learn about our comprehensive sustainability initiatives and environmental commitments.",
      date: "December 10, 2024",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      category: "Innovation",
      title: "Investing in the Future: Our New AI Research Center",
      excerpt: "Opening state-of-the-art facilities dedicated to artificial intelligence and machine learning.",
      date: "December 8, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      category: "Awards",
      title: "Recognition for Excellence in Corporate Governance",
      excerpt: "Ahmed Amin Group receives prestigious international award for business ethics and transparency.",
      date: "December 5, 2024",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
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
            News &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Insights
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest developments, achievements, and thought leadership 
            from across our global organization.
          </p>
        </motion.div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={news[0].image}
                  alt={news[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-blue-600 font-medium text-sm">{news[0].category}</span>
                </div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {news[0].title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {news[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {news[0].date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {news[0].readTime}
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group">
                    Read More
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {news.slice(1).map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
 