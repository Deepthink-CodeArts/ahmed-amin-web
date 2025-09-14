import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

const Footer = () => {
  const subsidiaries = [
    "Baraka Limited", "Business Development Corporation Ltd", "Career Overseas Consultants Ltd",
    "Baraka Engineers Limited", "BARAKA Logistics Pte. Ltd.", "Career Travel International Ltd",
    "Business Information Technology Limited", "Baraka Consumer Products Limited", "Saimon Medical Centre Ltd",
    "New Generation Hydrocarbon Services Ltd", "BARAKA Renewable Energy Ltd", "BARAKA Waste Management Ltd",
    "Medisys (BD) Limited", "Baraka Agro Fisheries Limited", "Advanced Gateway Technology (BD) Ltd",
    "Multicraft Technical Training Centre", "Heria Food International Ltd"
  ];

  const businessAssociates = [
    "Lubrizol", "Oren", "Sodexo", "Godrej", "Hengxin"
  ];

  return (
    <footer className="bg-background border-t border-border/20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/lovable-uploads/0507b7ab-20b7-4b04-94a9-f26b137437d0.png"
                alt="Ahmed Amin Group"
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-display text-xl font-bold text-primary">
                  Ahmed Amin Group
                </h3>
                <p className="text-sm text-muted-foreground">
                  Better Future Together
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              A prestigious conglomerate leading Bangladesh's industrial landscape through 
              innovation, excellence, and corporate leadership since 1998.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+880 (2) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@ahmedamingroup.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Quick Links
            </h4>
            <div className="space-y-3">
              <Link to="/about/founders-message" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Founder's Message
              </Link>
              <Link to="/about/company-background" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Company Background
              </Link>
              <Link to="/about/mission-vision" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Mission & Vision
              </Link>
              <Link to="/about/board-directors" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Board of Directors
              </Link>
              <Link to="/media" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Media Centre
              </Link>
              <Link to="/career" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Career Opportunities
              </Link>
            </div>
          </div>

          {/* Key Subsidiaries */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Key Subsidiaries
            </h4>
            <div className="space-y-2">
              {subsidiaries.slice(0, 8).map((subsidiary, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {subsidiary}
                </div>
              ))}
              <div className="text-sm text-primary font-medium">
                +{subsidiaries.length - 8} more companies
              </div>
            </div>
          </div>

          {/* Business Associates */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Global Partners
            </h4>
            <div className="space-y-3">
              {businessAssociates.map((partner, index) => (
                <div key={index} className="text-sm text-muted-foreground font-medium">
                  {partner}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h5 className="font-medium text-foreground mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 Ahmed Amin Group. All rights reserved. Developed by <a href="https://deepthinkcodearts.com" className="text-primary hover:text-primary-glow transition-colors">Deepthink CodeArts</a>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;