// schemas/tag.ts
import { IoPricetagOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: IoPricetagOutline,
  fields: [
    defineField({
      name: "title",
      title: "Tag Title",
      type: "string",
      description: "e.g. Organic, Limited Edition, New Arrival",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional details about this tag",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
