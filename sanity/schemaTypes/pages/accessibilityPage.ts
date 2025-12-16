import { FaUniversalAccess } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export const accessibilityPageType = defineType({
  name: "accessibilityPage",
  title: "Accessibility Statement",
  type: "document",
  icon: FaUniversalAccess,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Accessibility Statement",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Title for search engines.",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Description for search engines.",
        }),
      ],
    }),
  ],
});
