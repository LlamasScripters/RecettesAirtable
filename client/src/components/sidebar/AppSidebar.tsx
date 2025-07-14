import type * as React from "react";
import {
  ChefHat,
  Home,
  PlusCircle,
  Heart,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useTheme } from "../../contexts/ThemeContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="group-data-[state=collapsed]:block flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <p className="group-data-[state=collapsed]:hidden">RecettesAI</p>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/"}
                tooltip="Accueil"
              >
                <Link to="/">
                  <Home className="h-5 w-5" />
                  <span>Accueil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/recipes"}
                tooltip="Toutes les recettes"
              >
                <Link to="/recipes">
                  <BookOpen className="h-5 w-5" />
                  <span>Toutes les recettes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/recipes/new"}
                tooltip="Créer une nouvelle recette"
              >
                <Link to="/recipes/new">
                  <PlusCircle className="h-5 w-5" />
                  <span>Nouvelle recette</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Catégories</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/categories/starters"}
                tooltip="Entrées"
              >
                <Link to="/categories/$type" params={{ type: "starters" }}>
                  <span className="text-lg">🥗</span>
                  <span>Entrées</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/categories/main-dishes"}
                tooltip="Plats principaux"
              >
                <Link to="/categories/$type" params={{ type: "main-dishes" }}>
                  <span className="text-lg">🍽️</span>
                  <span>Plats principaux</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/categories/desserts"}
                tooltip="Desserts"
              >
                <Link to="/categories/$type" params={{ type: "desserts" }}>
                  <span className="text-lg">🍰</span>
                  <span>Desserts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/categories/sides"}
                tooltip="Accompagnements"
              >
                <Link to="/categories/$type" params={{ type: "sides" }}>
                  <span className="text-lg">🥖</span>
                  <span>Accompagnements</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/categories/drinks"}
                tooltip="Boissons"
              >
                <Link to="/categories/$type" params={{ type: "drinks" }}>
                  <span className="text-lg">🥤</span>
                  <span>Boissons</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personnel</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/favorites"}
                tooltip="Favoris"
              >
                <Link to="/favorites">
                  <Heart className="h-5 w-5" />
                  <span>Mes favoris</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={theme === 'dark' ? "Mode clair" : "Mode sombre"}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span>{theme === 'dark' ? "Mode clair" : "Mode sombre"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
