import { FaMapMarkedAlt } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: FaMapMarkedAlt,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Contact Us",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storeImage",
      title: "Store Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storeDescription",
      title: "Store Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Store Address",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.email().required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      description: "Include country code (e.g., +1234567890)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "instagram",
      title: "Instagram Handle/URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Other Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", title: "Platform", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "mapImage",
      title: "Map Snapshot/Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "A static image of the map location.",
    }),
    defineField({
      name: "seo",
      title: "Search Engine Optimization",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text" },
      ],
    }),
  ],
});
