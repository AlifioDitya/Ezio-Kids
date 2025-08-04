// schemas/color.ts
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
      title: "Color Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(50),
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
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
