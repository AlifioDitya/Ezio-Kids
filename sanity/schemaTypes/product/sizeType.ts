// schemas/size.ts
import { IoResizeOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "size",
  title: "Size",
  type: "document",
  icon: IoResizeOutline,
  fields: [
    defineField({
      name: "label",
      title: "Size Label",
      type: "string",
      description: "e.g. XS, S, M, L, XL, 6-12m",
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Controls ordering (smallest → largest)",
      initialValue: 0,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      order: "order",
    },
    prepare({ title, order }) {
      return {
        title,
        subtitle: `Order: ${order}`,
      };
    },
  },
});
