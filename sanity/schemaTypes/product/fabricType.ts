import { GiRolledCloth } from "react-icons/gi";
import { defineField, defineType } from "sanity";

export const fabricType = defineType({
  name: "fabric",
  title: "Fabric",
  type: "document",
  icon: GiRolledCloth,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Avatar Image",
      description: "Square aspect ratio recommended (e.g., 1080x1080)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Image",
      description: "Landscape high-res image for the collection page header",
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
      name: "journal",
      title: "Related Journal",
      description: "Link to a journal article explaining this fabric",
      type: "reference",
      to: [{ type: "journal" }],
    }),
    defineField({
      name: "weight",
      title: "Weight (gsm)",
      type: "string",
    }),
    defineField({
      name: "properties",
      title: "Additional Properties",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", title: "Key", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { key: "key", value: "value" },
            prepare({ key, value }) {
              return { title: key, subtitle: value };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
