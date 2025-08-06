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
      description: "e.g. 0-3 m, 3-6 m, 2T, 3T, etc.",
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
    defineField({
      name: "ageGroup",
      title: "Age Group",
      type: "string",
      options: {
        list: [
          { title: "Baby", value: "baby" },
          { title: "Toddler", value: "toddler" },
          { title: "Child", value: "child" },
          { title: "Youth", value: "youth" },
        ],
      },
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
