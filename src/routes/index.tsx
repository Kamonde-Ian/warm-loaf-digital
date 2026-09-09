import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Leaf, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { bestsellers, categories, products } from "@/lib/products";
import hero from "@/assets/hero.jpg";
import story from "@/assets/story.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tehila Royal Kitchen — Fresh Sourdough & Cakes in Nairobi" },
      {
        name: "description",
        content:
          "Handmade sourdough, celebration cakes, mandazi and pastries baked every morning on Ngong Road. Order online, pay with M-Pesa, collect or get it delivered.",
      },
      {
        property: "og:title",
        content: "Tehila Royal Kitchen — Fresh Sourdough & Cakes in Nairobi",
      },
      {
        property: "og:description",
        content:
          "Handmade sourdough, celebration cakes, mandazi and pastries baked every morning on Ngong Road. Pay with M-Pesa.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="surface-warm relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow">Ngong Road, Nairobi · since 2016</p>
            <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Baked before sunrise,
              <span className="block text-primary">eaten before noon.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              A small neighbourhood bakehouse working with Kenyan flour, real
              butter and slow time. No shortcuts, no premixes — just bread and
              cake worth the walk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/shop">
                  Shop today's bake <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-card"
              >
                <Link to="/custom-cakes">Order a custom cake</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Wheat className="size-4 text-primary" /> Flour
                </dt>
                <dd className="mt-1 font-display text-base">Stone-milled, local</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4 text-primary" /> Ferment
                </dt>
                <dd className="mt-1 font-display text-base">24 hours</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Leaf className="size-4 text-primary" /> Additives
                </dt>
                <dd className="mt-1 font-display text-base">None, ever</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Sourdough loaves, a naked cake and fresh mandazi on a wooden bakery counter"
              width={1600}
              height={1104}
              className="w-full rounded-3xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="rounded-full border border-border bg-card px-5 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              {c}
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Bestsellers carousel */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Loved by the neighbourhood</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">Best sellers this week</h2>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/shop">
              See the full menu <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>
        <Reveal delay={80}>
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-4">
              {bestsellers.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </Reveal>
      </section>

      {/* Story teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal className="grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-10 lg:grid-cols-2">
          <img
            src={story}
            alt="A baker kneading dough by hand on a floured wooden table"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full rounded-2xl object-cover"
          />
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">
              It started with one stubborn starter
            </h2>
            <p className="mt-4 text-muted-foreground">
              Wanjiru began baking in her mother's kitchen in Kilimani with a jar
              of starter she refused to let die. Ten years later that same
              starter still lifts every loaf we sell, and the bakehouse is still
              small enough that we know most of our customers by name.
            </p>
            <Button asChild variant="secondary" className="mt-6 rounded-full">
              <Link to="/about">Read our story</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Grid teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Fresh today</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Straight from the oven</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
