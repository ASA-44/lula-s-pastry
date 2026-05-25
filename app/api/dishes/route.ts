import { NextResponse } from "next/server";

import { getAvailableDishes } from "@/lib/data";
import { getDishesForMenuCategory, getMenuCategory } from "@/lib/menu";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const dishes = await getAvailableDishes();

  if (!categorySlug) {
    return NextResponse.json({
      count: dishes.length,
      dishes
    });
  }

  const category = getMenuCategory(categorySlug);

  if (!category) {
    return NextResponse.json(
      {
        error: "Category not found"
      },
      { status: 404 }
    );
  }

  const categoryDishes = getDishesForMenuCategory(dishes, category);

  return NextResponse.json({
    category: {
      slug: category.slug,
      title: category.title,
      subtitle: category.subtitle
    },
    count: categoryDishes.length,
    dishes: categoryDishes
  });
}
