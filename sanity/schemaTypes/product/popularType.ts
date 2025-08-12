import { IoStarOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "popular",
  title: "Popular Products",
  type: "document",
  description:
    "Manage popular products based on tags or categories to help users find trending items in the search page.",
  icon: IoStarOutline,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Popular Products",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Select tags to filter popular products",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Select categories to filter popular products",
    }),
  ],
});
