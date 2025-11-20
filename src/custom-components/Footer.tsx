import { SiLinkedin, SiX, SiGithub, SiInstagram, SiFacebook } from "react-icons/si";
import { HiEnvelope, HiPhone } from "react-icons/hi2";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Press", href: "#press" }
    ],
    resources: [
      { label: "Help Center", href: "#help" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" }
    ],
    employers: [
      { label: "Post a Job", href: "#post-job" },
      { label: "Browse Candidates", href: "#candidates" },
      { label: "Pricing", href: "#pricing" },
      { label: "Enterprise", href: "#enterprise" }
    ]
  };

  const socialLinks = [
    { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: SiX, href: "https://twitter.com", label: "Twitter" },
    { icon: SiGithub, href: "https://github.com", label: "GitHub" },
    { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" }
  ];

  return (
    <footer className="relative w-full bg-gray-900 border-t border-gray-800">
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3 sm:mb-4 font-poppins">
              Kabat Jobs
            </h2>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Find your dream job or discover the perfect candidate. Connecting talent with opportunity.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-secondary transition-colors">
                <HiEnvelope className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">contact@kabatjobs.com</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-secondary transition-colors">
                <HiPhone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-8 h-8 sm:w-10 sm:h-10 
                      flex items-center justify-center 
                      rounded-lg 
                      bg-gray-800/50 
                      border border-gray-700 
                      text-gray-400 
                      hover:text-secondary 
                      hover:bg-gray-800/80 
                      hover:border-blue-500/50 
                      transition-all duration-300
                      hover:scale-110
                    "
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 font-poppins">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 font-poppins">Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 font-poppins">For Employers</h3>
            <ul className="space-y-3">
              {links.employers.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="w-full md:w-auto">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2 font-poppins">
                Stay updated with Kabat Jobs
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Get the latest job opportunities and career tips delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto max-w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1 md:w-80 
                  px-3 sm:px-4 py-2 sm:py-3 
                  rounded-lg 
                  bg-gray-800/50 
                  border border-gray-700 
                  text-white 
                  placeholder-gray-500 
                  focus:outline-none 
                  focus:border-blue-500/50 
                  focus:ring-2 
                  focus:ring-blue-500/20 
                  transition-all
                  text-sm sm:text-base
                  w-full
                "
              />
              <button
                className="
                  px-5 sm:px-6 py-2 sm:py-3 
                  rounded-lg 
                  bg-gradient-to-r from-blue-600 to-blue-700 
                  text-white 
                  font-semibold 
                  hover:from-blue-700 
                  hover:to-blue-800 
                  transition-all duration-300
                  hover:scale-105
                  hover:shadow-lg hover:shadow-blue-500/30
                  text-sm sm:text-base
                "
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} Kabat Jobs. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <a href="#privacy" className="hover:text-secondary transition-colors">
                Privacy
              </a>
              <a href="#terms" className="hover:text-secondary transition-colors">
                Terms
              </a>
              <a href="#cookies" className="hover:text-secondary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </footer>
  );
};

export default Footer;

