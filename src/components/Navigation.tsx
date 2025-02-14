
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/" 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Expenses
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link 
            to="/projects" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/projects" 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Projects
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
