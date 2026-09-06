import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/lib/cart";
import { formatKES, getProduct, relatedProducts } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable — Tamu Bakehouse" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${formatKES(product.price)} | Tamu Bakehouse`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { addProduct } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={900}
          height={900}
          className="w-full rounded-3xl object-cover shadow-lift"
        />

        <div>
          {product.bestseller && (
            <Badge className="mb-3 bg-accent text-accent-foreground">
              Best seller
            </Badge>
          )}
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl text-primary">
            {formatKES(product.price)}
          </p>
          <p className="text-sm text-muted-foreground">{product.unit}</p>

          <p className="mt-6 text-base leading-relaxed text-foreground/85">
            {product.longDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2">
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-6 text-center font-display">{qty}</span>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => {
                addProduct(product, qty);
                toast.success(`${qty} × ${product.name} added to your basket`);
              }}
            >
              <ShoppingBag className="size-4" />
              Add to basket · {formatKES(product.price * qty)}
            </Button>
          </div>

          {product.category === "Custom Cakes" && (
            <p className="mt-4 text-sm text-muted-foreground">
              Want it your way?{" "}
              <Link to="/custom-cakes" className="text-primary underline">
                Send us a custom cake brief
              </Link>
              .
            </p>
          )}

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
            <Truck className="mt-0.5 size-4 shrink-0" />
            <p>
              Same-day pickup on Ngong Road for orders before 2:00 PM. Delivery
              across Nairobi from KES 300, paid by M-Pesa at checkout.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <Reveal className="mb-6">
          <p className="eyebrow">Goes well with</p>
          <h2 className="mt-2 text-3xl">You might also like</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {relatedProducts(product).map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
