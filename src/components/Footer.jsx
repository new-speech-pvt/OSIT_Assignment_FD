import React from "react";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-secondary-70 to-secondary-100 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <img
              src="https://gmsassets.z29.web.core.windows.net/public/logo1.png"
              alt="Speechgears Research Institute"
              className="h-8 mb-4 w-auto"
            />
            <p className="text-white/80 text-sm mb-4 max-w-md">
              Professional oral sensorimotor integration therapy management platform 
              dedicated to helping therapists and participants achieve better outcomes 
              through innovative technology and compassionate care.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Heart className="w-4 h-4" />
              <span>Committed to excellence in therapeutic care</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <Mail className="w-4 h-4 text-primary-50" />
                <span>info@speechgears.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <Phone className="w-4 h-4 text-primary-50" />
                <span>+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-start gap-3 text-white/80 text-sm">
                <MapPin className="w-4 h-4 text-primary-50 mt-0.5" />
                <span>SpeechGears India Pvt. Ltd.<br />India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-white/80 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors">
                Services
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors">
                Therapists
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2025 All rights reserved by SpeechGears India Pvt. Ltd.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;