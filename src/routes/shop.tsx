import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { categories, products, type Category } from "@/lib/products";

type ShopSearch = { category?: Category | "All" | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const raw = search["category"];
    return {
      category:
        typeof raw === "string" && (categories as readonly string[]).includes(raw)
          ? (raw as Category)
          : undefined,
    };
  },

  head: () => ({
    meta: [
      { title: "Menu & Shop — Tehila Royal Kitchen Nairobi" },
      {
        name: "description",
        content:
          "Browse breads, cakes, pastries, custom cakes and snacks with prices in KES. Filter by category, search, and order for pickup or delivery in Nairobi.",
      },
      { property: "og:title", content: "Menu & Shop — Tehila Royal Kitchen Nairobi" },
      {
        property: "og:description",
        content:
          "Breads, cakes, pastries and snacks baked daily in Nairobi. Prices in KES, pay with M-Pesa.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const active = category ?? "All";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCategory = active === "All" || p.category === active;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [active, query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">The menu</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Today at the bakehouse</h1>
        <p className="mt-4 text-muted-foreground">
          Everything is baked the morning you collect it. Orders placed before
          4:00 PM are ready the next morning from 8:00 AM.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sourdough, mandazi, cake…"
            aria-label="Search products"
            className="rounded-full bg-card pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() =>
                navigate({
                  search: c === "All" ? {} : { category: c as Category },
                })
              }
              className={
                "rounded-full border px-4 py-2 text-sm transition-colors " +
                (active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary hover:text-primary")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 60}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          Nothing matches that yet — try "cake" or "bread".
        </p>
      )}
    </main>
  );
}
