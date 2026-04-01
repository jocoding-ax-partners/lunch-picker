import { NextRequest, NextResponse } from "next/server";
import { getAllMenus, getFilteredMenus, addMenu, deleteMenu } from "@/lib/menus";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const priceRange = searchParams.get("price_range") || undefined;
  const spicyParam = searchParams.get("spicy");
  const spicy = spicyParam === null ? undefined : spicyParam === "true";

  const menus = category || priceRange || spicy !== undefined
    ? getFilteredMenus(category, priceRange, spicy)
    : getAllMenus();

  return NextResponse.json(menus);
}

export function POST(request: NextRequest) {
  return request.json().then((body) => {
    const { name, category, price_range, description, spicy } = body;
    if (!name || !category) {
      return NextResponse.json({ error: "name과 category는 필수입니다" }, { status: 400 });
    }
    const menu = addMenu({
      name,
      category,
      price_range: price_range || "보통",
      description: description || "",
      spicy: spicy || false,
    });
    return NextResponse.json(menu, { status: 201 });
  });
}

export function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다" }, { status: 400 });
  const deleted = deleteMenu(id);
  if (!deleted) return NextResponse.json({ error: "메뉴를 찾을 수 없습니다" }, { status: 404 });
  return NextResponse.json({ success: true });
}
