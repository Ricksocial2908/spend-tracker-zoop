import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export function Navigation() {
  const location = useLocation();

  return (
    <NavigationMenu className="mb-6">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Expenses
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/projects" className={navigationMenuTriggerStyle()}>
            Projects
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}