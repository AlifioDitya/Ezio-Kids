// schemas/color.ts
import { TRUE_COLOR_OPTIONS } from "@/app/constant";
import { IoColorPaletteOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "color",
  title: "Color",
  type: "document",
  icon: IoColorPaletteOutline,
  fields: [
    defineField({
      name: "name",
      title: "Color Print Name",
      description: "e.g. Blue Jeans, Red Plaid, etc.",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "trueColor",
      title: "True Color",
      description: "Canonical base color for filtering/facets.",
      type: "string",
      options: {
        list: [
          ...TRUE_COLOR_OPTIONS.map((c) => ({
            title: c.label,
            value: c.value,
          })),
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "swatch",
      title: "Swatch Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "swatch",
      trueColor: "trueColor",
    },
    prepare({ title, media, trueColor }) {
      return {
        title,
        subtitle: trueColor ? `Base: ${trueColor}` : undefined,
        media,
      };
    },
  },
});
