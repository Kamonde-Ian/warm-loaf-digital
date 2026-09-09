import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo.jpg.asset.json";

/** Two-second branded splash shown on first paint of any page / refresh. */
export function PageLoader() {
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 1700);
    const hide = setTimeout(() => setDone(true), 2000);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center surface-warm transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="animate-scale-in">
        <img
          src={logoAsset.url}
          alt=""
          className="size-40 rounded-full object-cover shadow-lift sm:size-52"
        />
      </div>
      <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ animation: "tehila-bar 1.8s ease-out forwards" }} />
      </div>
      <p className="mt-4 eyebrow">Tehila Royal Kitchen</p>
    </div>
  );
}
