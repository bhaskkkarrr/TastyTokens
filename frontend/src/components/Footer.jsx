import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 text-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 space-y-3 md:space-y-0">
        {/* Left Section */}
        <p className="text-sm tracking-wide text-emerald-100">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">DigiThali</span> — All rights
          reserved.
        </p>

        {/* Center Section */}
        <p className="text-sm text-emerald-200 italic">
          “Empowering restaurants with smart digital menus.”
        </p>

        {/* Right Section */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/bhaskkkarrr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors duration-200"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/bhaskar-chauhan-12230836b/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors duration-200"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://bhaskkkarrr.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors duration-200"
          >
            <Globe size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
