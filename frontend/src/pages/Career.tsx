import { useState } from "react";
import { Briefcase, MapPin, Clock, Users, ChevronRight, Search, Filter, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Career = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Technology",
      company: "Business Information Technology Limited",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      level: "Senior",
      description: "Lead the development of cutting-edge software solutions for our industrial clients.",
      requirements: ["5+ years experience", "React/Node.js expertise", "Team leadership skills"],
      posted: "2024-01-15"
    },
    {
      id: 2,
      title: "Environmental Engineer",
      department: "Environment",
      company: "BARAKA Waste Management Ltd",
      location: "Chittagong, Bangladesh",
      type: "Full-time",
      level: "Mid-level",
      description: "Design and implement sustainable waste management solutions for industrial clients.",
      requirements: ["Environmental Engineering degree", "3+ years experience", "Project management skills"],
      posted: "2024-01-12"
    },
    {
      id: 3,
      title: "Renewable Energy Specialist",
      department: "Energy",
      company: "BARAKA Renewable Energy Ltd",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      level: "Senior",
      description: "Drive the development and implementation of renewable energy projects across Bangladesh.",
      requirements: ["Renewable Energy expertise", "5+ years experience", "Project management certification"],
      posted: "2024-01-10"
    },
    {
      id: 4,
      title: "Healthcare Operations Manager",
      department: "Healthcare",
      company: "Saimon Medical Centre Ltd",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      level: "Senior",
      description: "Oversee healthcare facility operations and ensure excellence in patient care services.",
      requirements: ["Healthcare management experience", "Leadership skills", "Quality assurance expertise"],
      posted: "2024-01-08"
    },
    {
      id: 5,
      title: "Construction Project Manager",
      department: "Engineering",
      company: "Baraka Engineers Limited",
      location: "Multiple Locations",
      type: "Full-time",
      level: "Senior",
      description: "Lead major construction, dredging, and infrastructure development projects.",
      requirements: ["Civil Engineering degree", "7+ years experience", "PMP certification preferred"],
      posted: "2024-01-05"
    },
    {
      id: 6,
      title: "Business Development Executive",
      department: "Business Development",
      company: "Business Development Corporation Ltd",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      level: "Mid-level",
      description: "Identify and develop new business opportunities across various industry sectors.",
      requirements: ["Business degree", "3+ years BD experience", "Strong communication skills"],
      posted: "2024-01-03"
    }
  ];

  const departments = ["all", "Technology", "Environment", "Energy", "Healthcare", "Engineering", "Business Development"];
  const locations = ["all", "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Multiple Locations"];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const benefits = [
    {
      icon: GraduationCap,
      title: "Professional Development",
      description: "Continuous learning opportunities and skill development programs"
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Work with diverse, talented teams across multiple industries"
    },
    {
      icon: Award,
      title: "Recognition & Growth",
      description: "Merit-based advancement and achievement recognition programs"
    },
    {
      icon: Briefcase,
      title: "Comprehensive Benefits",
      description: "Health insurance, retirement plans, and performance bonuses"
    }
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
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Join Our Team
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Build Your
              <span className="text-primary block mt-2">Future</span>
            </h1>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join Ahmed Amin Group and become part of Bangladesh's leading 
              industrial conglomerate. Together, we're building tomorrow's 
              industries and shaping the future.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="glass-premium p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-2">17+</div>
              <div className="text-muted-foreground">Companies</div>
            </div>
            <div className="glass-premium p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-2">12+</div>
              <div className="text-muted-foreground">Industries</div>
            </div>
            <div className="glass-premium p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Employees</div>
            </div>
            <div className="glass-premium p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-primary mb-2">26+</div>
              <div className="text-muted-foreground">Years Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search & Filters */}
      <section className="py-8 bg-background border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-primary/20 focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48 glass border-primary/20">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48 glass border-primary/20">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc === "all" ? "All Locations" : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Current Openings
              </h2>
              <div className="text-muted-foreground">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  No Positions Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={`glass-premium p-8 rounded-3xl group hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 fade-in-up stagger-${index + 1}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {job.department}
                          </span>
                          <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground text-sm">
                            {job.level}
                          </span>
                          <span className="px-3 py-1 bg-muted rounded-full text-muted-foreground text-sm">
                            {job.type}
                          </span>
                        </div>

                        <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {job.title}
                        </h3>

                        <p className="text-primary font-semibold mb-4">{job.company}</p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Posted {new Date(job.posted).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:min-w-[200px]">
                        <Button
                          size="lg"
                          className="group/btn gradient-primary hover:shadow-glow transition-all duration-300"
                        >
                          Apply Now
                          <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Why Choose Ahmed Amin Group?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join a legacy of excellence and be part of Bangladesh's most 
              innovative industrial conglomerate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`glass-premium p-8 rounded-3xl text-center group hover:shadow-luxury transition-all duration-500 hover:-translate-y-3 fade-in-up stagger-${index + 1}`}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="glass-premium p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see the perfect role? Send us your resume and we'll keep you 
              in mind for future opportunities that match your skills and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Submit Your Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                Contact HR Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Career;