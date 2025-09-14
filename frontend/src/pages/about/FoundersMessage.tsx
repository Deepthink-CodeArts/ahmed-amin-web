import { Quote, Award, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const FoundersMessage = () => {
  return (
    <main className="pt-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <Quote className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Leadership Message
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Founder's
              <span className="text-primary block mt-2">Vision</span>
            </h1>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Founder Profile */}
            <div className="lg:col-span-1">
              <div className="glass-premium p-8 rounded-3xl sticky top-32">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 shadow-glow"></div>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Mr. Ahmed Amin"
                      className="w-44 h-44 rounded-full object-cover mx-auto mt-2"
                    />
                  </div>
                  
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Mr. Ahmed Amin
                  </h2>
                  <p className="text-primary font-semibold text-lg mb-6">
                    Chairman & Founder
                  </p>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">26+ Years Leadership</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">17+ Companies Founded</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">Industrial Innovation Pioneer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass p-8 rounded-3xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                  <Quote className="h-8 w-8 text-primary" />
                </div>
                
                <blockquote className="text-2xl md:text-3xl font-light text-foreground leading-relaxed italic mb-8">
                  "Building a better future together is not just our motto—it's the 
                  driving force behind every decision, every innovation, and every 
                  partnership we forge."
                </blockquote>
              </div>

              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Our Journey Began with a Vision
                  </h3>
                  <p className="text-lg leading-relaxed">
                    When I established Ahmed Amin Group in 1998, Bangladesh was at a 
                    pivotal moment in its industrial development. I envisioned a 
                    conglomerate that would not merely participate in this transformation 
                    but lead it with integrity, innovation, and an unwavering commitment 
                    to excellence.
                  </p>
                </div>

                <div className="glass p-8 rounded-3xl">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Commitment to Excellence
                  </h3>
                  <p className="text-lg leading-relaxed mb-4">
                    Over the past 26 years, we have built 17 subsidiary companies, 
                    each representing our dedication to different sectors of the economy. 
                    From engineering and technology to healthcare and renewable energy, 
                    every venture reflects our core belief that businesses should serve 
                    society while pursuing sustainable growth.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Our success is measured not just in financial terms, but in the 
                    positive impact we create for our communities, the opportunities 
                    we provide for our workforce, and the innovations we bring to 
                    the marketplace.
                  </p>
                </div>

                <div className="glass p-8 rounded-3xl">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Looking Toward Tomorrow
                  </h3>
                  <p className="text-lg leading-relaxed mb-4">
                    As we look to the future, our commitment remains unchanged. We will 
                    continue to invest in cutting-edge technologies, develop our human 
                    capital, and explore new frontiers that align with our vision of 
                    sustainable development.
                  </p>
                  <p className="text-lg leading-relaxed">
                    The challenges of tomorrow require innovative solutions today. 
                    Through our diverse portfolio of companies and our strategic 
                    partnerships with global leaders, we are well-positioned to meet 
                    these challenges head-on and continue building a better future 
                    for Bangladesh and beyond.
                  </p>
                </div>

                <div className="glass-premium p-10 rounded-3xl text-center">
                  <Quote className="h-12 w-12 text-primary mx-auto mb-6" />
                  <blockquote className="text-xl font-semibold text-foreground mb-8 leading-relaxed">
                    "I invite you to join us on this extraordinary journey as we continue 
                    to build bridges between innovation and tradition, between local 
                    expertise and global excellence, and between today's achievements 
                    and tomorrow's possibilities."
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className="w-16 h-[1px] bg-primary"></div>
                    <div className="text-primary font-bold">Ahmed Amin</div>
                    <div className="w-16 h-[1px] bg-primary"></div>
                  </div>
                  
                  <p className="text-primary font-semibold">
                    Chairman & Founder, Ahmed Amin Group
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="glass-premium p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Join Our Vision
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover how Ahmed Amin Group continues to shape the future through 
              innovation, excellence, and unwavering commitment to progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Explore Our Companies
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary"
              >
                Our Leadership Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FoundersMessage;