// app/components/Footer.jsx
'use client';

import { Mail, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white block">CogniPrep</span>
              <span className="text-xs text-gray-400">AI Interview Preparation</span>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a 
              href="mailto:support@cogniprep.com" 
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              support@cogniprep.com
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <a 
              href="https://github.com/cogniprep" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-gray-300" />
            </a>
            <a 
              href="https://linkedin.com/company/cogniprep" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-gray-300" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} CogniPrep. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="#privacy" 
              className="text-gray-500 hover:text-purple-400 text-sm transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#terms" 
              className="text-gray-500 hover:text-purple-400 text-sm transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}