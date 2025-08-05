import { IoSparklesOutline } from "react-icons/io5";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  icon: IoSparklesOutline,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Button Text",
          type: "string",
          validation: (Rule) => Rule.required().min(1).max(50),
        }),
        defineField({
          name: "href",
          title: "Button Link (URL)",
          description: "Links to eziokids.com/<your-path>",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, scheme: ["http", "https", "/"] }),
        }),
      ],
      validation: (Rule) => Rule.required(),
      options: { collapsible: true },
    }),
  ],
  preview: {
    select: {
      title: "heading",
      media: "backgroundImage",
    },
  },
});
