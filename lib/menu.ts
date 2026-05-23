import type { Dish } from "@/types/database";

export type MenuCategory = {
  slug: string;
  title: string;
  subtitle: string;
  categoryKeys: string[];
  fallbackItems: string[];
};

export const menuCategories: MenuCategory[] = [
  {
    slug: "pastries",
    title: "Pastries",
    subtitle: "Flaky, buttery favorites for any time of day.",
    categoryKeys: ["pastry", "bread"],
    fallbackItems: ["Chocolate Croissant", "Plain Croissant", "Apple Danish", "Cinnamon Roll"]
  },
  {
    slug: "muffins-cookies",
    title: "Muffins & Cookies",
    subtitle: "Small sweet bites, freshly baked and ready to share.",
    categoryKeys: ["muffin", "cookie", "cookies"],
    fallbackItems: ["Blueberry Muffin", "Chocolate Chip Muffin", "Almond Cookies", "Oatmeal Cookies"]
  },
  {
    slug: "cakes",
    title: "Cakes",
    subtitle: "Celebration-ready cakes made with Lula's soft sponge layers.",
    categoryKeys: ["cake"],
    fallbackItems: ["Strawberry Cake", "Chocolate Cake", "Vanilla Cake", "Red Velvet Cake"]
  },
  {
    slug: "tarts-pies",
    title: "Tarts & Pies",
    subtitle: "Fruit-forward bakes with crisp crusts and rich fillings.",
    categoryKeys: ["tart", "tarts", "pie"],
    fallbackItems: ["Fruit Tart", "Lemon Tart", "Apple Pie", "Cherry Pie"]
  }
];

export function getMenuCategory(slug: string) {
  return menuCategories.find((category) => category.slug === slug) ?? null;
}

export function getDishesForMenuCategory(dishes: Dish[], category: MenuCategory) {
  return dishes.filter((dish) => {
    const categoryName = dish.category?.toLowerCase() ?? "";
    return category.categoryKeys.includes(categoryName);
  });
}

export function getMenuPreviewItems(dishes: Dish[], category: MenuCategory) {
  const dishNames = getDishesForMenuCategory(dishes, category).map((dish) => dish.name);
  return dishNames.length > 0 ? dishNames.slice(0, 4) : category.fallbackItems;
}
