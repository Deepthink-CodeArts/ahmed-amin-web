import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    {
      icon: MapPin,
      title: "Global Headquarters",
      details: ["Dubai Business Bay", "United Arab Emirates"],
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+971 4 123 4567", "+971 4 123 4568"],
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@ahmedamingroup.com", "investors@ahmedamingroup.com"],
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Sunday - Thursday: 9:00 AM - 6:00 PM", "Friday - Saturday: Closed"],
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Get In
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {" "}Touch
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to explore partnership opportunities or learn more about our services? 
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input
                    type="text"
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-32"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg text-lg font-medium group">
                  Send Message
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </div>
 