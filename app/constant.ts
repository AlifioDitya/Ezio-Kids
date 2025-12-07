export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

export const NAV_LINKS: NavItem[] = [
  { label: "Catalog", href: "/catalog" },
  {
    label: "Collar Types",
    children: [
      { label: "Classic", href: "/collections/classic" },
      { label: "Cuban", href: "/collections/cuban" },
      { label: "Band", href: "/collections/band" },
    ],
  },
  {
    label: "Materials",
    children: [
      { label: "Melange", href: "/collections/melange" },
      { label: "Chambray", href: "/collections/chambray" },
      { label: "Dobby", href: "/collections/dobby" },
    ],
  },
  { label: "Journal", href: "/journal" },
  { label: "About us", href: "/about" },
];

export const ALLOWED_SLUGS = [
  "see-all",
  "catalog",
  "new-arrival",
  "baby-toddler",
  "kids",
  "teens",

  // New Collars
  "classic",
  "cuban",
  "band",

  // New Materials
  "melange",
  "chambray",
  "dobby",
] as const;

export type Slug = (typeof ALLOWED_SLUGS)[number];

export const TITLES: Record<
  Slug,
  { h1: string; title: string; description: string }
> = {
  "see-all": {
    h1: "All Products",
    title: "Catalog - Ezio Kids",
    description:
      "Discover every playful, sustainable piece in our kidswear universe. Filter by color, size, or category to find your favorites.",
  },
  catalog: {
    h1: "All Products",
    title: "All Products - Ezio Kids",
    description: "Browse our full catalog of sustainable kidswear.",
  },
  "new-arrival": {
    h1: "New in Ezio Kids",
    title: "New Arrivals - Ezio Kids",
    description:
      "Be the first to shop our latest drops—fresh styles and trending looks for every age.",
  },
  "baby-toddler": {
    h1: "For Babies & Toddlers",
    title: "Baby & Toddler Clothes - Ezio Kids",
    description:
      "Soft, durable, and adorable outfits for little ones aged 0-3. Explore gentle fabrics and playful prints.",
  },
  kids: {
    h1: "For Kids",
    title: "Kidswear - Ezio Kids",
    description:
      "From playground to party, shop comfy and cool styles for growing kids.",
  },
  teens: {
    h1: "For Teens",
    title: "Teen Collection - Ezio Kids",
    description:
      "Confident, expressive looks for teens—find the latest trends and timeless essentials.",
  },
  classic: {
    h1: "Classic Collars",
    title: "Classic Collars - Ezio Kids",
    description: "Timeless classic collar styles for every occasion.",
  },
  cuban: {
    h1: "Cuban Collars",
    title: "Cuban Collars - Ezio Kids",
    description: "Relaxed and stylish Cuban collar shirts.",
  },
  band: {
    h1: "Band Collars",
    title: "Band Collars - Ezio Kids",
    description: "Modern and sleek band collar designs.",
  },
  melange: {
    h1: "Melange Collection",
    title: "Melange Fabrics - Ezio Kids",
    description: "Textured and comfortable melange fabric collection.",
  },
  chambray: {
    h1: "Chambray Collection",
    title: "Chambray Fabrics - Ezio Kids",
    description: "Soft and breathable chambray styles.",
  },
  dobby: {
    h1: "Dobby Collection",
    title: "Dobby Fabrics - Ezio Kids",
    description: "Woven patterned dobby fabric collection.",
  },
};

/** Base color options — keep in sync with your schema list */
export const TRUE_COLOR_OPTIONS: {
  label: string;
  value: string;
  css: string;
}[] = [
  {
    label: "Multi",
    value: "multi",
    css: "conic-gradient(#f59e0b, #ef4444, #6366f1, #10b981, #f59e0b)",
  },

  { label: "Black", value: "black", css: "#000000" },
  { label: "White", value: "white", css: "#ffffff" },
  {
    label: "Gray",
    value: "gray",
    css: "linear-gradient(135deg,#9ca3af,#6b7280)",
  },
  {
    label: "Silver",
    value: "silver",
    css: "linear-gradient(135deg,#c0c0c0,#a3a3a3)",
  },

  { label: "Beige", value: "beige", css: "#f5f5dc" },
  { label: "Cream", value: "cream", css: "#fffdd0" },
  { label: "Brown", value: "brown", css: "#8b4513" },
  { label: "Tan", value: "tan", css: "#d2b48c" },

  { label: "Navy", value: "navy", css: "#001f3f" },
  { label: "Blue", value: "blue", css: "#3b82f6" },
  { label: "Light Blue", value: "light-blue", css: "#93c5fd" },
  { label: "Teal", value: "teal", css: "#14b8a6" },
  { label: "Turquoise", value: "turquoise", css: "#40e0d0" },

  { label: "Green", value: "green", css: "#22c55e" },
  { label: "Olive", value: "olive", css: "#556b2f" },
  { label: "Lime", value: "lime", css: "#84cc16" },

  { label: "Yellow", value: "yellow", css: "#facc15" },
  {
    label: "Gold",
    value: "gold",
    css: "linear-gradient(135deg,#f59e0b,#d97706)",
  },
  { label: "Orange", value: "orange", css: "#fb923c" },
  { label: "Coral", value: "coral", css: "#ff7f50" },

  { label: "Red", value: "red", css: "#ef4444" },
  { label: "Burgundy", value: "burgundy", css: "#800020" },

  { label: "Pink", value: "pink", css: "#ec4899" },
  { label: "Magenta", value: "magenta", css: "#ff00ff" },

  { label: "Purple", value: "purple", css: "#a855f7" },
  { label: "Lavender", value: "lavender", css: "#c4b5fd" },
];

export type AgeGroup = "baby" | "toddler" | "child" | "teens";
