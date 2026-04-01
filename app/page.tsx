"use client";

import { useState, useEffect, useCallback } from "react";

interface Menu {
  id: string;
  name: string;
  category: string;
  price_range: string;
  description: string;
  spicy: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  한식: "bg-red-500/20 text-red-300 border-red-500/30",
  중식: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  일식: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  양식: "bg-green-500/20 text-green-300 border-green-500/30",
  동남아: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  분식: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const PRICE_EMOJI: Record<string, string> = {
  저렴: "💰",
  보통: "💰💰",
  비싼: "💰💰💰",
};

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [picked, setPicked] = useState<Menu | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("?");
  const [filter, setFilter] = useState({ category: "", spicy: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "한식", price_range: "보통", description: "", spicy: false });

  const fetchMenus = useCallback(() => {
    const params = new URLSearchParams();
    if (filter.category) params.set("category", filter.category);
    if (filter.spicy) params.set("spicy", filter.spicy);
    fetch(`/api/menus?${params}`).then((r) => r.json()).then(setMenus);
  }, [filter]);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const spin = () => {
    if (spinning || menus.length === 0) return;
    setSpinning(true);
    setPicked(null);

    let count = 0;
    const total = 20 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
      setDisplayName(menus[Math.floor(Math.random() * menus.length)].name);
      count++;
      if (count >= total) {
        clearInterval(interval);
        const params = new URLSearchParams();
        if (filter.category) params.set("category", filter.category);
        if (filter.spicy) params.set("spicy", filter.spicy);
        fetch(`/api/menus/random?${params}`)
          .then((r) => r.json())
          .then((menu) => {
            setPicked(menu);
            setDisplayName(menu.name);
            setSpinning(false);
          });
      }
    }, 80);
  };

  const addMenu = () => {
    if (!form.name.trim()) return;
    fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({ name: "", category: "한식", price_range: "보통", description: "", spicy: false });
      setShowForm(false);
      fetchMenus();
    });
  };

  const removeMenu = (id: string) => {
    fetch(`/api/menus?id=${id}`, { method: "DELETE" }).then(() => fetchMenus());
  };

  const categories = [...new Set(menus.map((m) => m.category))];

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <h1 className="mb-2 text-center text-5xl font-black tracking-tight">
          점심 뭐먹지<span className="text-cyan-400">?</span>
        </h1>
        <p className="mb-10 text-center text-slate-400">결정장애 퇴치기</p>

        {/* Slot Machine */}
        <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-8 text-center backdrop-blur">
          <div
            className={`mb-6 inline-block rounded-xl border-2 px-12 py-6 text-4xl font-black transition-all ${
              spinning
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                : picked
                ? "border-amber-400 bg-amber-400/10 text-amber-300 animate-bounce-in"
                : "border-slate-600 bg-slate-700/50 text-slate-300"
            }`}
          >
            {displayName}
          </div>

          {picked && !spinning && (
            <div className="mb-4 space-y-1 text-slate-300">
              <p>
                <span className={`inline-block rounded-full border px-3 py-0.5 text-sm ${CATEGORY_COLORS[picked.category] || "bg-slate-600 text-slate-300"}`}>
                  {picked.category}
                </span>
                <span className="ml-2 text-sm">{PRICE_EMOJI[picked.price_range]}</span>
                {picked.spicy && <span className="ml-2 text-sm">🌶️</span>}
              </p>
              <p className="text-sm text-slate-400">{picked.description}</p>
            </div>
          )}

          <button
            onClick={spin}
            disabled={spinning || menus.length === 0}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-3 text-lg font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spinning ? "고르는 중..." : "🎰 돌려돌려!"}
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="rounded-lg border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200"
          >
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filter.spicy}
            onChange={(e) => setFilter((f) => ({ ...f, spicy: e.target.value }))}
            className="rounded-lg border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200"
          >
            <option value="">매운맛 무관</option>
            <option value="true">🌶️ 매운 것만</option>
            <option value="false">순한 것만</option>
          </select>

          <button
            onClick={() => setShowForm(!showForm)}
            className="ml-auto rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
          >
            {showForm ? "취소" : "+ 메뉴 추가"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="메뉴 이름"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="col-span-2 rounded-lg border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400"
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-lg border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
              >
                {["한식", "중식", "일식", "양식", "동남아", "분식"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={form.price_range}
                onChange={(e) => setForm((f) => ({ ...f, price_range: e.target.value }))}
                className="rounded-lg border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
              >
                {["저렴", "보통", "비싼"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <input
                placeholder="설명 (선택)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-lg border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400"
              />
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.spicy}
                  onChange={(e) => setForm((f) => ({ ...f, spicy: e.target.checked }))}
                  className="rounded border-slate-600 bg-slate-700 text-cyan-500"
                />
                🌶️ 매운맛
              </label>
            </div>
            <button
              onClick={addMenu}
              className="mt-3 w-full rounded-lg bg-cyan-600 py-2 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              추가하기
            </button>
          </div>
        )}

        {/* Menu List */}
        <div className="space-y-2">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="group flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-5 py-3 transition hover:border-slate-600 hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">{menu.name}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[menu.category] || "bg-slate-600 text-slate-300"}`}>
                  {menu.category}
                </span>
                <span className="text-xs text-slate-500">{PRICE_EMOJI[menu.price_range]}</span>
                {menu.spicy && <span className="text-xs">🌶️</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{menu.description}</span>
                <button
                  onClick={() => removeMenu(menu.id)}
                  className="text-slate-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {menus.length === 0 && (
          <p className="mt-8 text-center text-slate-500">조건에 맞는 메뉴가 없습니다</p>
        )}

        <p className="mt-12 text-center text-xs text-slate-600">
          Powered by AppHub
        </p>
      </div>
    </main>
  );
}
