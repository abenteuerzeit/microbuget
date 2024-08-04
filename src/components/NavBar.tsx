"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";

const components = [
  {
    title: "Overview",
    href: "/",
    description: "Dashboard and general overview",
  },
  {
    title: "Transactions",
    href: "/transactions",
    description: "Manage and view your transactions",
  },
];

export default function NavBar() {
  return (
    <header className="bg-background p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            {components.map((component) => (
              <NavigationMenuItem key={component.title}>
                <NavigationMenuLink asChild>
                  <Link
                    href={component.href}
                    className={cn("p-2 hover:bg-gray-200 rounded")}
                  >
                    {component.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
