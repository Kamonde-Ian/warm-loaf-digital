import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { products } from "@/lib/products";
import story from "@/assets/story.jpg";

const shots = [
  { src: story, alt: "Baker shaping dough on a floured counter at dawn" },
  ...products.map((p) => ({ src: p.image, alt: `${p.name} at Tehila Royal Kitchen` })),
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Bakes from Tehila Royal Kitchen Nairobi" },
      {
        name: "description",
        content:
          "Photographs from our Ngong Road kitchen: sourdough crusts, cardamom mandazi, buttercream celebration cakes and everything in between.",
      },
      { property: "og:title", content: "Gallery — Bakes from Tehila Royal Kitchen Nairobi" },
      {
        property: "og:description",
        content: "A look inside our Nairobi bakery, one tray at a time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">In the kitchen</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Gallery</h1>
        <p className="mt-4 text-muted-foreground">
          No stock photos here — everything you see came out of our own oven on
          Ngong Road.
        </p>
      </header>

      <div className="mt-10 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {shots.map((shot, i) => (
          <Reveal key={shot.alt} delay={(i % 6) * 60}>
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              width={600}
              height={600}
              className="w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="rounded-full">
          <Link to="/shop">Order what you see</Link>
        </Button>
      </div>
    </main>
  );
}
