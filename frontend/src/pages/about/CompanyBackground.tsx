import { Calendar, Users, Award, Globe, Building, TrendingUp } from "lucide-react";

const CompanyBackground = () => {
  const milestones = [
    {
      year: "1998",
      title: "Foundation & First Steps",
      description: "Ahmed Amin Group established with Baraka Limited and Business Development Corporation Ltd",
      icon: Building,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "1999-2000",
      title: "Strategic Expansion",
      description: "Launched Career Overseas Consultants, Baraka Engineers Limited, and expanded into logistics",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      year: "2001-2003",
      title: "Technology Integration",
      description: "Entered IT sector and hydrocarbon services, establishing technological foundations",
      icon: Globe,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2007-2008",
      title: "Sustainability Focus",
      description: "Pioneered renewable energy and waste management solutions in Bangladesh",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      year: "2016-2019",
      title: "Diversification Era",
      description: "Expanded into agriculture, advanced technology, and strengthened our portfolio",
      icon: Award,
      color: "from-orange-500 to-orange-600"
    },
    {
      year: "2024",
      title: "Future Ready",
      description: "Launched education and international food ventures, preparing for the next decade",
      icon: Calendar,
      color: "from-primary to-primary-glow"
    }
  ];

  const stats = [
    { label: "Years of Excellence", value: "26+", icon: Calendar },
    { label: "Subsidiary Companies", value: "17+", icon: Building },
    { label: "Industry Sectors", value: "12+", icon: Globe },
    { label: "Global Partners", value: "5+", icon: Users }
  ];

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
              <Building className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Heritage
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Company
              <span className="text-primary block mt-2">Background</span>
            </h1>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              From humble beginnings to industry leadership, discover the remarkable 
              journey that shaped Ahmed Amin Group into Bangladesh's premier 
              industrial conglomerate.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="glass-premium p-6 rounded-2xl text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="glass-premium p-12 rounded-3xl mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-8">
                Our Story
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Ahmed Amin Group began its journey in 1998 with a vision to contribute 
                  meaningfully to Bangladesh's industrial development. Founded by Mr. Ahmed Amin, 
                  our group started with two pioneering companies: Baraka Limited and Business 
                  Development Corporation Ltd (BDCL), both established to address the growing 
                  needs of the industrial sector.
                </p>
                
                <p>
                  From the very beginning, we understood that sustainable growth required a 
                  diversified approach. Our early ventures into manufacturing and business 
                  development laid the foundation for what would become a comprehensive 
                  industrial ecosystem spanning multiple sectors.
                </p>
                
                <p>
                  Over the decades, we have evolved from a small industrial group into a 
                  conglomerate with 17 subsidiary companies, each specializing in different 
                  aspects of modern industry. Our commitment to excellence, innovation, and 
                  ethical business practices has remained constant throughout this remarkable 
                  journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones that defined our growth and shaped our legacy
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-primary-glow to-primary h-full"></div>

              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full shadow-glow z-10 border-4 border-background"></div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="glass-premium p-8 rounded-3xl group hover:shadow-luxury transition-all duration-500">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${index % 2 === 0 ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
                        <milestone.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="glass-premium p-10 rounded-3xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                  Our Foundation
                </h3>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Built on principles of integrity, innovation, and excellence, Ahmed Amin Group 
                  has consistently demonstrated that ethical business practices and sustainable 
                  growth go hand in hand.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Commitment to quality and excellence in all endeavors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Innovation-driven approach to industrial challenges</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Sustainable business practices for long-term impact</span>
                  </li>
                </ul>
              </div>

              <div className="glass-premium p-10 rounded-3xl">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                  Global Outlook
                </h3>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  While deeply rooted in Bangladesh, our vision extends globally. We continuously 
                  seek international partnerships and adopt global best practices to enhance our 
                  capabilities and reach.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Strategic partnerships with international leaders</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Adoption of global standards and practices</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <span className="text-muted-foreground">Contribution to Bangladesh's global competitiveness</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CompanyBackground;