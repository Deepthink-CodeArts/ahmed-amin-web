import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Building, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiry_type: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Building,
      title: "Corporate Headquarters",
      details: [
        "Ahmed Amin Group",
        "House #123, Road #456",
        "Gulshan-2, Dhaka 1212",
        "Bangladesh"
      ]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "+880 2 9876543",
        "+880 2 9876544",
        "+880 1700 123456",
        "Fax: +880 2 9876545"
      ]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@ahmedamingroup.com",
        "admin@ahmedamingroup.com",
        "careers@ahmedamingroup.com",
        "media@ahmedamingroup.com"
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Sunday - Thursday",
        "9:00 AM - 6:00 PM",
        "Friday: 9:00 AM - 5:00 PM",
        "Saturday: Closed"
      ]
    }
  ];

  const inquiryTypes = [
    "General Inquiry",
    "Business Partnership",
    "Career Opportunities",
    "Media & Press",
    "Investor Relations",
    "Customer Support",
    "Technical Support"
  ];

  const offices = [
    {
      city: "Dhaka",
      type: "Headquarters",
      address: "House #123, Road #456, Gulshan-2, Dhaka 1212",
      phone: "+880 2 9876543",
      email: "dhaka@ahmedamingroup.com"
    },
    {
      city: "Chittagong",
      type: "Regional Office",
      address: "Building #789, CDA Avenue, Chittagong 4000",
      phone: "+880 31 987654",
      email: "chittagong@ahmedamingroup.com"
    },
    {
      city: "Sylhet",
      type: "Branch Office",
      address: "Suite #456, Zindabazar, Sylhet 3100",
      phone: "+880 821 12345",
      email: "sylhet@ahmedamingroup.com"
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
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Get In Touch
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Contact
              <span className="text-primary block mt-2">Our Team</span>
            </h1>
            
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-glow"></div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Ready to build a better future together? Connect with Ahmed Amin Group 
              and discover how we can collaborate to achieve extraordinary results.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-premium p-10 rounded-3xl">
                <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="glass border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email address"
                        className="glass border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company/Organization
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Enter your company name"
                        className="glass border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Inquiry Type *
                      </label>
                      <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange("inquiry_type", value)}>
                        <SelectTrigger className="glass border-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Enter message subject"
                      className="glass border-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Enter your message details..."
                      rows={6}
                      className="glass border-primary/20 focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Send Message
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`glass-premium p-8 rounded-3xl fade-in-up stagger-${index + 1}`}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    {info.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Our Office Locations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visit us at any of our offices across Bangladesh for in-person consultations and meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className={`glass-premium p-8 rounded-3xl text-center group hover:shadow-luxury transition-all duration-500 hover:-translate-y-3 fade-in-up stagger-${index + 1}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {office.city}
                </h3>
                <p className="text-primary font-semibold mb-6">{office.type}</p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{office.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{office.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="glass-premium p-8 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                Find Us on the Map
              </h3>
              <p className="text-muted-foreground">
                Our headquarters location in the heart of Dhaka's business district
              </p>
            </div>
            
            {/* Placeholder for map - you would integrate with Google Maps, Mapbox, etc. */}
            <div className="w-full h-96 bg-muted/20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map integration would go here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="glass-premium p-12 rounded-3xl max-w-4xl mx-auto text-center">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Let's Build a Better Future Together
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're looking for partnership opportunities, career prospects, 
              or simply want to learn more about our work, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Schedule a Meeting
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;