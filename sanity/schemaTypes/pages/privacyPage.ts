import { FaUserShield } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export const privacyPageType = defineType({
  name: "privacyPage",
  title: "Privacy Policy",
  type: "document",
  icon: FaUserShield,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Privacy Policy",
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
