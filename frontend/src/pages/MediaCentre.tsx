import { useState } from "react";
import { Camera, Video, FileText, Calendar, ExternalLink, Search, Filter, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MediaCentre = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mediaItems = [
    {
      id: 1,
      type: "video",
      title: "Ahmed Amin Group: Building Tomorrow's Industries",
      description: "An exclusive look at our industrial facilities and innovation centers across Bangladesh.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      date: "2024-01-15",
      category: "Corporate"
    },
    {
      id: 2,
      type: "photo",
      title: "Renewable Energy Facility Launch",
      description: "Grand opening of BARAKA Renewable Energy Ltd's latest solar power installation.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
      date: "2024-01-10",
      category: "Events"
    },
    {
      id: 3,
      type: "article",
      title: "Leading Bangladesh's Industrial Revolution",
      description: "Press release on Ahmed Amin Group's contribution to the national economy.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
      date: "2024-01-05",
      category: "Press Release"
    },
    {
      id: 4,
      type: "video",
      title: "Sustainability Initiatives Showcase",
      description: "Highlighting our environmental conservation and waste management programs.",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=400&fit=crop",
      date: "2023-12-20",
      category: "Sustainability"
    },
    {
      id: 5,
      type: "photo",
      title: "Annual Leadership Summit 2023",
      description: "Our board of directors and management personnel gathering for strategic planning.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
      date: "2023-12-15",
      category: "Events"
    },
    {
      id: 6,
      type: "article",
      title: "Technology Innovation Awards",
      description: "Ahmed Amin Group receives recognition for technological advancement in Bangladesh.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      date: "2023-12-10",
      category: "Awards"
    }
  ];

  const categories = ["all", "Corporate", "Events", "Press Release", "Sustainability", "Awards"];

  const filteredItems = mediaItems.filter(item => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "photo": return Camera;
      case "article": return FileText;
      default: return FileText;
    }
  };

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
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Media Centre
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Stories of
              <span className="text-primary block mt-2">Excellence</span>
            </h1>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore our latest news, events, and achievements through photos, 
              videos, and press releases that showcase our journey of innovation 
              and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-background border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-primary/20 focus:border-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeTab === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(category)}
                  className={`${
                    activeTab === category
                      ? "gradient-primary"
                      : "border-primary/20 hover:border-primary hover:bg-primary/10"
                  } transition-all duration-300`}
                >
                  {category === "all" ? "All Media" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                No Media Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className={`glass-premium rounded-3xl overflow-hidden group hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 fade-in-up stagger-${index + 1}`}
                  >
                    {/* Media Preview */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Type Indicator */}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>

                      {/* Play Button for Videos */}
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 rounded-full text-xs font-medium text-primary backdrop-blur-sm">
                        {item.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {item.description}
                      </p>

                      <Button
                        variant="ghost"
                        className="w-full justify-between text-primary hover:bg-primary/10 transition-all duration-300 group/btn"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {filteredItems.length >= 6 && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                Load More Media
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="glass-premium p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Stay Updated
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news, events, and 
              updates from Ahmed Amin Group directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="glass border-primary/20 focus:border-primary"
              />
              <Button
                size="lg"
                className="gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MediaCentre;