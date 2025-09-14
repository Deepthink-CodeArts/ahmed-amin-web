import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutUsItems = [
    { title: "Founder's Message", href: "/about/founders-message" },
    { title: "Company Background", href: "/about/company-background" },
    { title: "Mission & Vision", href: "/about/mission-vision" },
    { title: "Board of Directors", href: "/about/board-directors" },
    { title: "Management Personnels", href: "/about/management" },
    { title: "Business Associates", href: "/about/business-associates" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass shadow-elegant py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/lovable-uploads/0507b7ab-20b7-4b04-94a9-f26b137437d0.png"
              alt="Ahmed Amin Group"
              className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden md:block">
              <h1 className="font-display text-xl font-bold text-primary">
                Ahmed Amin Group
              </h1>
              <p className="text-xs text-muted-foreground font-light">
                Better Future Together
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      location.pathname === "/"
                        ? "text-white bg-primary shadow-glow"
                        : "text-foreground hover:text-primary hover:bg-secondary/20"
                    }`}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors bg-transparent">
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="glass border border-border/20 rounded-xl p-6 w-80">
                    <div className="grid gap-2">
                      {aboutUsItems.map((item) => (
                        <Link key={item.href} to={item.href}>
                          <NavigationMenuLink className="block p-3 rounded-lg transition-all duration-300 hover:bg-secondary/20 hover:text-primary group">
                            <div className="font-medium">{item.title}</div>
                          </NavigationMenuLink>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/media">
                  <NavigationMenuLink
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      location.pathname === "/media"
                        ? "text-white bg-primary shadow-glow"
                        : "text-foreground hover:text-primary hover:bg-secondary/20"
                    }`}
                  >
                    Media Centre
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/career">
                  <NavigationMenuLink
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      location.pathname === "/career"
                        ? "text-white bg-primary shadow-glow"
                        : "text-foreground hover:text-primary hover:bg-secondary/20"
                    }`}
                  >
                    Career
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      location.pathname === "/contact"
                        ? "text-white bg-primary shadow-glow"
                        : "text-foreground hover:text-primary hover:bg-secondary/20"
                    }`}
                  >
                    Contact Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-xl p-6 space-y-4">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="space-y-2">
              <div className="py-2 text-foreground font-medium">About Us</div>
              <div className="pl-4 space-y-2">
                {aboutUsItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/media"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Media Centre
            </Link>

            <Link
              to="/career"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Career
            </Link>

            <Link
              to="/contact"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;