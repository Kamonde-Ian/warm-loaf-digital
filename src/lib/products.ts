import sourdoughAsset from "@/assets/p-sourdough.jpg.asset.json";
import wholewheatAsset from "@/assets/p-wholewheat.jpg.asset.json";
import bananaAsset from "@/assets/p-banana.jpg.asset.json";
import milkbreadAsset from "@/assets/p-milkbread.jpg.asset.json";
import redvelvetAsset from "@/assets/p-redvelvet.jpg.asset.json";
import chocolateAsset from "@/assets/p-chocolate.jpg.asset.json";
import carrotAsset from "@/assets/p-carrot.jpg.asset.json";
import mandaziAsset from "@/assets/p-mandazi.jpg.asset.json";
import croissantAsset from "@/assets/p-croissant.jpg.asset.json";
import cinnamonAsset from "@/assets/p-cinnamon.jpg.asset.json";
import celebrationAsset from "@/assets/p-celebration.jpg.asset.json";
import weddingAsset from "@/assets/p-wedding.jpg.asset.json";
import samosaAsset from "@/assets/p-samosa.jpg.asset.json";
import cookiesAsset from "@/assets/p-cookies.jpg.asset.json";

const sourdough = sourdoughAsset.url;
const wholewheat = wholewheatAsset.url;
const banana = bananaAsset.url;
const milkbread = milkbreadAsset.url;
const redvelvet = redvelvetAsset.url;
const chocolate = chocolateAsset.url;
const carrot = carrotAsset.url;
const mandazi = mandaziAsset.url;
const croissant = croissantAsset.url;
const cinnamon = cinnamonAsset.url;
const celebration = celebrationAsset.url;
const wedding = weddingAsset.url;
const samosa = samosaAsset.url;
const cookies = cookiesAsset.url;

/**
 * Placeholder catalogue.
 * SUPABASE: replace with a `products` table read (id, slug, name, price_kes,
 * category, description, image_url, is_bestseller, stock). Keep this shape so
 * components need no changes.
 */
export const categories = [
  "Breads",
  "Cakes",
  "Pastries",
  "Custom Cakes",
  "Snacks",
] as const;

export type Category = (typeof categories)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // KES
  unit: string;
  category: Category;
  description: string;
  longDescription: string;
  image: string;
  bestseller?: boolean;
};

export const products: Product[] = [
  {
    id: "brd-01",
    slug: "country-sourdough",
    name: "Country Sourdough",
    price: 550,
    unit: "800g loaf",
    category: "Breads",
    description: "Slow-fermented for 24 hours with our 6-year-old starter.",
    longDescription:
      "A deeply flavoured country loaf made from stone-milled Kenyan wheat, fermented for a full 24 hours and baked on stone for a blistered, crackling crust. Open crumb, gentle tang, and it keeps beautifully for three days wrapped in cloth.",
    image: sourdough,
    bestseller: true,
  },
  {
    id: "brd-02",
    slug: "seeded-whole-wheat",
    name: "Seeded Whole Wheat",
    price: 480,
    unit: "700g loaf",
    category: "Breads",
    description: "Sunflower, sesame and flax on a soft whole-wheat crumb.",
    longDescription:
      "Wholesome and everyday-friendly: 100% whole-wheat flour from a mill in Nakuru, finished with a triple seed crust. Perfect for school lunch boxes and morning toast.",
    image: wholewheat,
  },
  {
    id: "brd-03",
    slug: "banana-walnut-loaf",
    name: "Banana Walnut Loaf",
    price: 620,
    unit: "600g loaf",
    category: "Breads",
    description: "Overripe local bananas, brown butter and toasted walnuts.",
    longDescription:
      "We buy bananas at their sweetest from Kangemi market, mash them into a brown-butter batter and fold in toasted walnuts. Moist, barely sweet, and gone by lunchtime.",
    image: banana,
    bestseller: true,
  },
  {
    id: "brd-04",
    slug: "soft-milk-rolls",
    name: "Soft Milk Rolls",
    price: 350,
    unit: "pack of 6",
    category: "Breads",
    description: "Pillowy tangzhong rolls brushed with butter.",
    longDescription:
      "Made with the tangzhong method so they stay feather-soft for two days. Pull-apart rolls for burgers, chai, or straight from the bag.",
    image: milkbread,
  },
  {
    id: "cke-01",
    slug: "red-velvet-cake",
    name: "Red Velvet Cake",
    price: 3200,
    unit: "6 inch, serves 8",
    category: "Cakes",
    description: "Buttermilk crumb with tangy cream cheese frosting.",
    longDescription:
      "Our most-requested celebration cake: a tender buttermilk-cocoa crumb layered with real cream cheese frosting, finished with a smooth crown. Available in 6, 8 and 10 inch.",
    image: redvelvet,
    bestseller: true,
  },
  {
    id: "cke-02",
    slug: "dark-chocolate-fudge-cake",
    name: "Dark Chocolate Fudge Cake",
    price: 3500,
    unit: "6 inch, serves 8",
    category: "Cakes",
    description: "70% cocoa ganache poured over a fudgy crumb.",
    longDescription:
      "Serious chocolate. A damp, fudgy crumb built on 70% cocoa, soaked in vanilla syrup and drenched in a glossy ganache that sets to a soft shell.",
    image: chocolate,
  },
  {
    id: "cke-03",
    slug: "spiced-carrot-cake",
    name: "Spiced Carrot Cake",
    price: 2950,
    unit: "square, serves 6",
    category: "Cakes",
    description: "Cinnamon, cardamom, carrots and walnut crunch.",
    longDescription:
      "Grated carrots, warm cardamom and cinnamon, a whisper of orange zest, and a thick cap of cream cheese frosting with candied walnuts on top.",
    image: carrot,
  },
  {
    id: "pst-01",
    slug: "mandazi",
    name: "Cardamom Mandazi",
    price: 200,
    unit: "pack of 6",
    category: "Pastries",
    description: "Coconut milk and cardamom, fried fresh each morning.",
    longDescription:
      "The pastry we grew up on, done properly: coconut milk dough, fresh-ground cardamom, fried to order before 10am. Best with chai.",
    image: mandazi,
    bestseller: true,
  },
  {
    id: "pst-02",
    slug: "butter-croissant",
    name: "Butter Croissant",
    price: 260,
    unit: "each",
    category: "Pastries",
    description: "27 layers, laminated over three days.",
    longDescription:
      "A three-day croissant: slow-proofed dough laminated with cultured butter, baked to a shatter-crisp shell and a honeycomb interior.",
    image: croissant,
  },
  {
    id: "pst-03",
    slug: "cinnamon-rolls",
    name: "Cinnamon Rolls",
    price: 320,
    unit: "each",
    category: "Pastries",
    description: "Gooey centre, cream cheese glaze, still warm.",
    longDescription:
      "Baked in trays so the middles stay soft and sticky, then finished with a tangy cream cheese glaze while the pan is still warm.",
    image: cinnamon,
    bestseller: true,
  },
  {
    id: "cus-01",
    slug: "custom-celebration-cake",
    name: "Custom Celebration Cake",
    price: 4500,
    unit: "from, 2 tiers",
    category: "Custom Cakes",
    description: "Your flavour, your colours, hand-finished buttercream.",
    longDescription:
      "Birthdays, graduations, baby showers. Choose the flavour, palette and finish and we hand-decorate it in our Nairobi kitchen. Two working days notice, please.",
    image: celebration,
  },
  {
    id: "cus-02",
    slug: "wedding-cake",
    name: "Wedding Cake",
    price: 18000,
    unit: "from, 3 tiers",
    category: "Custom Cakes",
    description: "Tasting session included, delivered and set up.",
    longDescription:
      "A quiet, modern wedding cake with dried florals or fresh blooms. Includes a tasting session, structural build, delivery within Nairobi and on-site setup.",
    image: wedding,
  },
  {
    id: "snk-01",
    slug: "beef-samosas",
    name: "Beef Samosas",
    price: 300,
    unit: "pack of 5",
    category: "Snacks",
    description: "Hand-folded, spiced beef, chilli dip included.",
    longDescription:
      "Hand-folded every morning with lean minced beef, coriander and green chilli. Comes with our house tamarind-chilli dip.",
    image: samosa,
  },
  {
    id: "snk-02",
    slug: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    price: 400,
    unit: "pack of 4",
    category: "Snacks",
    description: "Brown-butter dough with dark chocolate chunks.",
    longDescription:
      "Thick, chewy, sea-salt-flecked cookies made with brown butter and 55% chocolate chunks. Rested 36 hours before baking.",
    image: cookies,
    bestseller: true,
  },
];

export const formatKES = (amount: number) =>
  `KES ${amount.toLocaleString("en-KE")}`;

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const bestsellers = products.filter((p) => p.bestseller);

export const relatedProducts = (product: Product) =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.filter((p) => p.category !== product.category && p.bestseller))
    .slice(0, 4);
