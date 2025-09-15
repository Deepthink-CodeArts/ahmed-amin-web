import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary-dark to-background"></div>
      
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary-dark to-background" style={{ zIndex: 1 }}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => {
            console.error('Video failed to load:', e);
          }}
          onLoadStart={() => {
            console.log('Video started loading');
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
          onLoadedData={() => {
            console.log('Video data loaded');
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl hero-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl hero-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl hero-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative text-center px-6 max-w-6xl mx-auto" style={{ zIndex: 10 }}>
        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-shimmer block">Better Future</span>
            <span className="text-primary block mt-2">Together</span>
          </h1>
          
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
          
          {/* <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Leading Bangladesh's industrial landscape through innovation, 
            excellence, and unwavering commitment to corporate leadership since 1998.
          </p> */}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="group px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
          >
            Explore Our Legacy
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="group px-8 py-4 text-lg font-semibold glass border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-glow"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Watch Our Story
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center fade-in-up stagger-1">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">26+</div>
            <div className="text-muted-foreground font-medium">Years of Excellence</div>
          </div>
          
          <div className="text-center fade-in-up stagger-2">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">17+</div>
            <div className="text-muted-foreground font-medium">Subsidiary Companies</div>
          </div>
          
          <div className="text-center fade-in-up stagger-3">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5+</div>
            <div className="text-muted-foreground font-medium">Global Partners</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ zIndex: 10 }}>
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;