import { TbCategory } from "react-icons/tb";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TbCategory,
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
});
