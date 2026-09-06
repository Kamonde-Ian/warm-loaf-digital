import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatKES, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();

  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-warm">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.bestseller && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
            Best seller
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="eyebrow">{product.category}</p>
        <h3 className="text-lg leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="font-display text-lg text-foreground">
              {formatKES(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">{product.unit}</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              addProduct(product);
              toast.success(`${product.name} added to your basket`);
            }}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
