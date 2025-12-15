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
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      description:
        "Phone number for the 'Contact Us' button (e.g., 628123456789). Do not include '+' or dashes.",
      type: "string",
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
