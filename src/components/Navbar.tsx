
import React from "react";
import { Link } from "react-router-dom";
import { Home, Hospital, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary transition-all duration-300 hover:opacity-80"
        >
          <Hospital className="h-6 w-6" />
          <span className="text-xl font-medium">HospitalHub</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <NavLink to="/" icon={<Home className="h-4 w-4 md:mr-2" />} label="Home" />
          <NavLink to="/hospitals" icon={<Hospital className="h-4 w-4 md:mr-2" />} label="Hospitals" />
          <NavLink 
            to="/create" 
            icon={<PlusCircle className="h-4 w-4 md:mr-2" />} 
            label="Add Hospital" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, className }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
};

export default Navbar;
