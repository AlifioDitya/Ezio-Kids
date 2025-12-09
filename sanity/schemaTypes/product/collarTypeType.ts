import { IoShirtOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export const collarTypeType = defineType({
  name: "collarType",
  title: "Collar Type",
  type: "document",
  icon: IoShirtOutline,
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
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
