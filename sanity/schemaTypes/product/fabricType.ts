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
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
