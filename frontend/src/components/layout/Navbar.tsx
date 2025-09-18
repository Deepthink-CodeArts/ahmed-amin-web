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
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img
              src="/lovable-uploads/0507b7ab-20b7-4b04-94a9-f26b137437d0.png"
              alt="Ahmed Amin Group"
              className="h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-300 group-hover:scale-110"
            />
            {/* <div className="hidden sm:block">
              <h1 className={`font-display text-lg sm:text-xl font-bold transition-colors ${
                isScrolled ? "text-gray-900 group-hover:text-blue-600" : "text-white group-hover:text-blue-300"
              }`}>
                Ahmed Amin Group
              </h1>
              <p className={`text-xs font-light ${
                isScrolled ? "text-gray-600" : "text-white/80"
              }`}>
                Better Future Together
              </p>
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                      location.pathname === "/"
                        ? "text-white bg-blue-600 shadow-lg"
                        : isScrolled 
                          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white hover:text-blue-300 hover:bg-white/10"
                    }`}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={`transition-colors bg-transparent text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-600 data-[active]:bg-blue-50 data-[active]:text-blue-600 ${
                  isScrolled 
                    ? "text-gray-700 hover:text-blue-600" 
                    : "text-white hover:text-blue-300 hover:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-blue-300 data-[active]:bg-white/10 data-[active]:text-blue-300"
                }`}>
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-72 shadow-xl">
                    <div className="grid gap-1">
                      {aboutUsItems.map((item) => (
                        <Link key={item.href} to={item.href}>
                          <NavigationMenuLink className="block p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 group">
                            <div className="font-medium text-sm">{item.title}</div>
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
                    className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                      location.pathname === "/media"
                        ? "text-white bg-blue-600 shadow-lg"
                        : isScrolled 
                          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white hover:text-blue-300 hover:bg-white/10"
                    }`}
                  >
                    Media Centre
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/career">
                  <NavigationMenuLink
                    className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                      location.pathname === "/career"
                        ? "text-white bg-blue-600 shadow-lg"
                        : isScrolled 
                          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white hover:text-blue-300 hover:bg-white/10"
                    }`}
                  >
                    Career
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink
                    className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                      location.pathname === "/contact"
                        ? "text-white bg-blue-600 shadow-lg"
                        : isScrolled 
                          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          : "text-white hover:text-blue-300 hover:bg-white/10"
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
            className={`lg:hidden transition-colors ${
              isScrolled 
                ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                : "text-white hover:text-blue-300 hover:bg-white/10"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-xl p-4 space-y-3 shadow-xl border border-gray-200">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="space-y-2">
              <div className="py-2 text-gray-700 font-medium">About Us</div>
              <div className="pl-4 space-y-2">
                {aboutUsItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/media"
              className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Media Centre
            </Link>

            <Link
              to="/career"
              className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Career
            </Link>

            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
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