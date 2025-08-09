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
