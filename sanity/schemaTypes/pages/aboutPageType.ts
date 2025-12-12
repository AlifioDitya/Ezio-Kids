import { FaFileAlt } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: FaFileAlt,
  fields: [
    // Hero Section
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "hero",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      group: "hero",
    }),

    // Story Section
    defineField({
      name: "storyTitle",
      title: "Story Title",
      type: "string",
      group: "story",
    }),
    defineField({
      name: "storyContent",
      title: "Story Content",
      type: "array",
      of: [{ type: "block" }],
      group: "story",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      options: { hotspot: true },
      group: "story",
    }),

    // Values Section
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({ name: "icon", title: "Icon/Image", type: "image" }),
          ],
          preview: {
            select: { title: "title", media: "icon" },
          },
        },
      ],
      group: "values",
    }),

    // SEO
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "story", title: "Story Section" },
    { name: "values", title: "Values Section" },
    { name: "seo", title: "SEO" },
  ],
  preview: {
    select: {
      title: "heroHeading",
    },
    prepare({ title }) {
      return {
        title: title || "About Page",
      };
    },
  },
});
