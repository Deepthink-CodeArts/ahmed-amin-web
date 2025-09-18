import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Users, Award, Globe, Heart, Quote, TrendingUp, Calendar, Target, Zap } from "lucide-react";

// Animated Counter Hook
const useAnimatedCounter = (end: number, duration: number = 2000, isInView: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
};

export default function NewAboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Building2, label: "Companies", value: 17, suffix: "+", color: "text-blue-600" },
    { icon: Calendar, label: "Years Excellence", value: 26, suffix: "+", color: "text-green-600" },
    { icon: Users, label: "Team Members", value: 15000, suffix: "+", color: "text-purple-600" },
    { icon: Globe, label: "Countries", value: 25, suffix: "+", color: "text-orange-600" },
    { icon: Target, label: "Projects Completed", value: 1000, suffix: "+", color: "text-red-600" },
    { icon: Award, label: "Awards Won", value: 150, suffix: "+", color: "text-indigo-600" }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(59,130,246,0.1)_50%,transparent_51%)] bg-[length:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Stats Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Impact in Numbers
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const animatedValue = useAnimatedCounter(stat.value, 2000, isInView);
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {animatedValue.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Main About Section */}
        <div className="mb-24">
          {/* Section Header
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-[1px] bg-primary"></div>
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                About Ahmed Amin Group
              </span>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Pioneering
              <span className="text-primary block mt-2">Excellence</span>
            </h2>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
          </motion.div> */}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Since our establishment in 1998, Ahmed Amin Group has emerged as a distinguished 
                  conglomerate, leading Bangladesh's industrial advancement through strategic vision, 
                  innovative solutions, and unwavering commitment to excellence.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our journey began with a simple yet powerful belief: that through innovation, 
                  dedication, and ethical business practices, we could build a better future for 
                  Bangladesh and contribute meaningfully to the global industrial landscape.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-center p-6 glass rounded-2xl"
                >
                  <div className="text-3xl font-bold text-primary mb-2">26+</div>
                  <div className="text-muted-foreground">Years Excellence</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center p-6 glass rounded-2xl"
                >
                  <div className="text-3xl font-bold text-primary mb-2">17+</div>
                  <div className="text-muted-foreground">Companies</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Founders Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="glass-premium p-8 rounded-3xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  {/* Founders Image */}
                  <div className="relative mb-8">
                    <div className="w-full h-120 rounded-2xl overflow-hidden relative group">
                      <img
                        src="/images/ahmed-amin-founders.jpg"
                        alt="Ahmed Amin Group Founders"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Quote Overlay */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-background/90 backdrop-blur-sm rounded-xl p-6">
                          <Quote className="h-6 w-6 text-primary mb-3" />
                          <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
                            "Our mission has always been clear: to build sustainable industrial solutions 
                            that not only drive economic growth but also contribute to the betterment of 
                            society."
                          </blockquote>
                          <div className="mt-4 pt-4 border-t border-border/20">
                            <div className="font-semibold text-foreground">AZHARUDDIN AHMED</div>
                            <div className="text-primary text-sm">Founder President</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}