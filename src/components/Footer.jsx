import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Local Konnect */}
          <div className="footer-column space-y-4">
            <h3 className="text-xl font-bold text-white">Local Konnect</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting you with trusted local service professionals.
            </p>
            <div className="social-links flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61568531426403"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/localkonnect/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/local-konnect"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors text-white"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors text-white"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-column space-y-4">
            <h3 className="text-xl font-bold text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://localkonnect.com/about.html" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#trails" className="hover:text-white transition-colors">Blog</a></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="footer-column space-y-4">
            <h3 className="text-xl font-bold text-white">Information</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://localkonnect.com/terms&conditions.html" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="https://localkonnect.com/privacypolicy.html" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="https://localkonnect.com/refundpolicy.html" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="https://localkonnect.com/cancellation.html" className="hover:text-white transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-column space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <a href="tel:+919571364889" className="hover:text-white transition-colors">+91 9571364889</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <a href="mailto:info@localkonnect.com" className="hover:text-white transition-colors">info@localkonnect.com</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/place/Bikaner,+Rajasthan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Bikaner, Rajasthan
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 LocalKonnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
