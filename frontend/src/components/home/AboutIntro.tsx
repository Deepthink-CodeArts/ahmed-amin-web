import { Building2, Users, Award, Globe, Quote, Heart } from "lucide-react";

const AboutIntro = () => {
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
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(212,175,55,0.1)_50%,transparent_51%)] bg-[length:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main About Section */}
        <div className="mb-24">
          {/* Section Header */}
          <div className="text-center mb-16">
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
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
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
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-3xl font-bold text-primary mb-2">26+</div>
                  <div className="text-muted-foreground">Years Excellence</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-3xl font-bold text-primary mb-2">17+</div>
                  <div className="text-muted-foreground">Companies</div>
                </div>
              </div>
            </div>

            {/* Right Side - Founders Image */}
            <div className="relative">
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
            </div>
          </div>
        </div>



      </div>
    </section>
  );
};

export default AboutIntro;