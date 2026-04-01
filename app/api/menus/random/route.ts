import { NextRequest, NextResponse } from "next/server";
import { getRandomMenu } from "@/lib/menus";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const spicyParam = searchParams.get("spicy");
  const spicy = spicyParam === null ? undefined : spicyParam === "true";

  const menu = getRandomMenu(category, spicy);
  if (!menu) return NextResponse.json({ error: "조건에 맞는 메뉴가 없습니다" }, { status: 404 });
  return NextResponse.json(menu);
}
