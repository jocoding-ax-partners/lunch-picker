export interface Menu {
  id: string;
  name: string;
  category: string;
  price_range: string;
  description: string;
  spicy: boolean;
}

const menus: Menu[] = [
  { id: "1", name: "김치찌개", category: "한식", price_range: "저렴", description: "든든한 한 끼, 밥도둑", spicy: true },
  { id: "2", name: "제육볶음", category: "한식", price_range: "보통", description: "매콤달콤 돼지고기 볶음", spicy: true },
  { id: "3", name: "돈까스", category: "일식", price_range: "보통", description: "바삭한 튀김의 정석", spicy: false },
  { id: "4", name: "짜장면", category: "중식", price_range: "저렴", description: "달달한 춘장의 유혹", spicy: false },
  { id: "5", name: "짬뽕", category: "중식", price_range: "보통", description: "얼큰한 해물 국물", spicy: true },
  { id: "6", name: "초밥", category: "일식", price_range: "비싼", description: "신선한 회와 밥의 조합", spicy: false },
  { id: "7", name: "파스타", category: "양식", price_range: "보통", description: "크림 or 토마토, 당신의 선택", spicy: false },
  { id: "8", name: "햄버거", category: "양식", price_range: "보통", description: "육즙 가득 패티", spicy: false },
  { id: "9", name: "쌀국수", category: "동남아", price_range: "보통", description: "가볍고 시원한 베트남 국물", spicy: false },
  { id: "10", name: "떡볶이", category: "분식", price_range: "저렴", description: "국민 간식이자 한 끼", spicy: true },
  { id: "11", name: "비빔밥", category: "한식", price_range: "보통", description: "영양 균형 완벽한 한 그릇", spicy: false },
  { id: "12", name: "칼국수", category: "한식", price_range: "저렴", description: "시원한 국물에 쫄깃한 면", spicy: false },
  { id: "13", name: "카레", category: "일식", price_range: "저렴", description: "달콤하고 깊은 맛", spicy: false },
  { id: "14", name: "마라탕", category: "중식", price_range: "보통", description: "얼얼하고 중독적인 매운맛", spicy: true },
  { id: "15", name: "타코", category: "양식", price_range: "보통", description: "바삭한 또띠야에 풍성한 속", spicy: false },
];

let nextId = menus.length + 1;

export function getAllMenus(): Menu[] {
  return [...menus];
}

export function getFilteredMenus(category?: string, priceRange?: string, spicy?: boolean): Menu[] {
  return menus.filter((m) => {
    if (category && m.category !== category) return false;
    if (priceRange && m.price_range !== priceRange) return false;
    if (spicy !== undefined && m.spicy !== spicy) return false;
    return true;
  });
}

export function addMenu(data: Omit<Menu, "id">): Menu {
  const menu: Menu = { ...data, id: String(nextId++) };
  menus.push(menu);
  return menu;
}

export function deleteMenu(id: string): boolean {
  const idx = menus.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  menus.splice(idx, 1);
  return true;
}

export function getRandomMenu(category?: string, spicy?: boolean): Menu | null {
  const filtered = menus.filter((m) => {
    if (category && m.category !== category) return false;
    if (spicy !== undefined && m.spicy !== spicy) return false;
    return true;
  });
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getCategories(): string[] {
  return [...new Set(menus.map((m) => m.category))];
}
