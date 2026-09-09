import { Link } from "@tanstack/react-router";
import { BAKERY_PHONE } from "@/lib/mpesa";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-cocoa text-cocoa-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Tehila Royal Kitchen</p>
          <p className="mt-3 text-sm text-cocoa-foreground/75">
            A small bakery on Ngong Road baking with local flour, real butter and
            unhurried time.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cocoa-foreground/60">
            Shop
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop" className="hover:text-accent">
                All products
              </Link>
            </li>
            <li>
              <Link to="/custom-cakes" className="hover:text-accent">
                Custom cakes
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-accent">
                Basket
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cocoa-foreground/60">
            Bakery
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-accent">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-accent">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Visit us
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-accent">
                Staff dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cocoa-foreground/60">
            Hours
          </p>
          <p className="text-sm text-cocoa-foreground/80">
            Mon – Sat, 7:00 AM – 7:00 PM
            <br />
            Sun, 8:00 AM – 3:00 PM
          </p>
          <p className="mt-3 text-sm">{BAKERY_PHONE}</p>
        </div>
      </div>
      <div className="border-t border-cocoa-foreground/15 px-4 py-5 text-center text-xs text-cocoa-foreground/60">
        © {new Date().getFullYear()} Tehila Royal Kitchen · Ngong Road, Nairobi · Pay by
        M-Pesa
      </div>
    </footer>
  );
}
