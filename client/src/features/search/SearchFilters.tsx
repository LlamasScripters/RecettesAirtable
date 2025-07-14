import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useAllergies,
  useDifficultyLevels,
  useRecipeTypes,
} from "@/features/recipes/hooks/use-recipes";
import { useRecipeStore } from "@/features/recipes/stores/recipes.store";
import { cn } from "@/lib/utils";
import type {
  Allergy,
  DifficultyLevel,
  RecipeQuery,
  RecipeType,
} from "@/types";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchFilters() {
  const router = useRouter();
  const search = useSearch({ from: "/" });
  const {
    setLastSearch,
    allergies: userAllergies,
    setAllergies,
  } = useRecipeStore();

  const [searchTerm, setSearchTerm] = useState(search.search || "");
  const [selectedType, setSelectedType] = useState<RecipeType | undefined>(
    search.type as RecipeType | undefined
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    DifficultyLevel | undefined
  >(search.difficulty as DifficultyLevel | undefined);
  const [selectedAllergies, setSelectedAllergies] =
    useState<Allergy[]>(userAllergies);

  const { data: recipeTypes = [] } = useRecipeTypes();
  const { data: difficultyLevels = [] } = useDifficultyLevels();
  const { data: allergiesList = [] } = useAllergies();

  const applyFilters = () => {
    const query: RecipeQuery = {};

    if (searchTerm) {
      query.search = searchTerm;
    }

    if (selectedType) {
      query.type = selectedType;
    }

    if (selectedDifficulty) {
      query.difficulty = selectedDifficulty;
    }

    if (selectedAllergies.length > 0) {
      query.allergies = selectedAllergies;
      setAllergies(selectedAllergies);
    }

    setLastSearch(query);

    router.navigate({
      to: "/",
      search: query,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType(undefined);
    setSelectedDifficulty(undefined);
    setSelectedAllergies([]);
    setAllergies([]);

    router.navigate({
      to: "/",
      search: {},
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  useEffect(() => {
    setSelectedAllergies(userAllergies);
  }, [userAllergies]);

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex gap-2">
                <Filter size={18} />
                {selectedType ? selectedType : "Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Type de recette</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {recipeTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedType === type}
                    onCheckedChange={(checked) => {
                      setSelectedType(checked ? type : undefined);
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex gap-2">
                <Filter size={18} />
                {selectedDifficulty ? selectedDifficulty : "Difficulté"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Niveau de difficulté</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {difficultyLevels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={selectedDifficulty === level}
                    onCheckedChange={(checked) => {
                      setSelectedDifficulty(checked ? level : undefined);
                    }}
                  >
                    {level}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "inline-flex gap-2",
                  selectedAllergies.length > 0 &&
                    "border-emerald-500 bg-emerald-50 text-emerald-700"
                )}
              >
                <Filter size={18} />
                {selectedAllergies.length > 0
                  ? `${selectedAllergies.length} allergie${selectedAllergies.length > 1 ? "s" : ""}`
                  : "Allergies"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Allergies à exclure</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {allergiesList.map((allergy) => (
                  <DropdownMenuCheckboxItem
                    key={allergy}
                    checked={selectedAllergies.includes(allergy)}
                    onCheckedChange={(checked) => {
                      setSelectedAllergies(
                        checked
                          ? [...selectedAllergies, allergy]
                          : selectedAllergies.filter((a) => a !== allergy)
                      );
                    }}
                  >
                    {allergy}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="submit">Rechercher</Button>

          {(searchTerm ||
            selectedType ||
            selectedDifficulty ||
            selectedAllergies.length > 0) && (
            <Button
              type="button"
              variant="ghost"
              onClick={resetFilters}
              className="gap-2"
            >
              <X size={18} />
              Réinitialiser
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
