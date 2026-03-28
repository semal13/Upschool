/** "true" / "1" iken sahte/mock veri ve offline acil plan dönülmez; hata döner. */
export const isStrictNoFallback = () =>
  import.meta.env.VITE_STRICT_NO_FALLBACK === "true" ||
  import.meta.env.VITE_STRICT_NO_FALLBACK === "1";
