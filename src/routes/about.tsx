import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import story from "@/assets/story.jpg";

const values = [
  {
    title: "Local flour first",
    body: "Stone-milled wheat from Nakuru, bananas from Kangemi market, honey from Kitui.",
  },
  {
    title: "Slow by choice",
    body: "Our sourdough ferments 24 hours and our croissants take three days. Time is the ingredient.",
  },
  {
    title: "Real butter, always",
    body: "No margarine, no shortcuts, no improvers. If we can't pronounce it, we don't bake with it.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Tamu Bakehouse, Ngong Road" },
      {
        name: "description",
        content:
          "How a Sunday kitchen habit on Ngong Road became a small Nairobi bakery baking with local flour, real butter and unhurried time.",
      },
      { property: "og:title", content: "Our Story — Tamu Bakehouse, Ngong Road" },
      {
        property: "og:description",
        content: "A small Nairobi bakery built on local flour and slow fermentation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Since 2018</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">
          A bakery that started with one stubborn starter
        </h1>
      </header>

      <Reveal className="mt-10">
        <img
          src={story}
          alt="Baker shaping dough on a floured wooden counter"
          width={1200}
          height={700}
          className="w-full rounded-3xl object-cover shadow-lift"
        />
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-base leading-relaxed text-foreground/85">
          <p>
            Tamu began in a two-bedroom flat off Ngong Road, with a jar of starter
            fed on flour and patience, and neighbours knocking on Sunday mornings
            for whatever came out of the oven.
          </p>
          <p>
            Seven years later we still bake in small batches, still shape every loaf
            by hand, and still sell out most afternoons. The shop is small on
            purpose — it keeps us close to the dough and close to the people eating
            it.
          </p>
          <p>
            Come by early for mandazi and chai, or order the night before and
            collect a warm loaf on your way to work.
          </p>
        </div>

        <div className="space-y-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display text-lg">{v.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg" className="rounded-full">
          <Link to="/shop">See today's menu</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to="/contact">Visit the bakehouse</Link>
        </Button>
      </div>
    </main>
  );
}
