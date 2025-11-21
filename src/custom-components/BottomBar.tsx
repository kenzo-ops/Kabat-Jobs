import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, Bell, Bookmark, Users, Settings } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Friends",
      href: "/friends",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Inbox",
      href: "/inbox",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      label: "Saved",
      href: "/saved-jobs",
      icon: <Bookmark className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "#settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      // Handle hash navigation if needed
      return;
    }
    navigate(href);
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glass morphism bottom bar */}
      <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)]">
        {/* Gradient overlay */}
        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-t from-white/5 to-white/0 pointer-events-none" />
        
        {/* Navigation items */}
        <nav className="relative flex items-center justify-around px-1 py-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  active
                    ? "bg-white/10 text-white scale-105"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium truncate max-w-full ${active ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomBar;
