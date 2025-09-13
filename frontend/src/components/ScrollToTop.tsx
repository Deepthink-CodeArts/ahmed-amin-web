import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Special case for contact page - scroll to contact form
    if (pathname === '/contact') {
      // Use a small delay to ensure the page has rendered
      setTimeout(() => {
        // Try to find the contact form or contact section
        const contactForm = document.querySelector('#contact-form') || 
                           document.querySelector('.contact-form') ||
                           document.querySelector('[data-contact-form]');
        
        const contactSection = document.querySelector('#contact') ||
                             document.querySelector('.contact-section') ||
                             document.querySelector('[data-contact-section]');
        
        // Scroll to contact form first, then contact section, or default to center of page
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // If no specific contact elements found, scroll to middle of page
          const pageHeight = document.documentElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          const scrollPosition = Math.max(0, (pageHeight - viewportHeight) / 2);
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // For all other pages, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 