import { FaBoxes } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export const catalogPageType = defineType({
  name: "catalogPage",
  title: "Catalog Page",
  type: "document",
  icon: FaBoxes,
  fields: [
    defineField({
      name: "bannerImage",
      title: "Banner Image",
      description: "Landscape high-res image for the catalog page header",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bannerTitle",
      title: "Banner Title",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short description shown on the banner",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "bannerTitle",
      media: "bannerImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "Catalog Page",
        media: media,
      };
    },
  },
});
