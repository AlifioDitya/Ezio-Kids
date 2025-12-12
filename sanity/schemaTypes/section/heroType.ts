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
      name: "backgroundVideo",
      title: "Background Video (Desktop)",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/ogg" },
      description:
        "Optional video background for desktop. Takes precedence over the image.",
    }),
    defineField({
      name: "mobileBackgroundVideo",
      title: "Background Video (Mobile)",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/ogg" },
      description:
        "Optional video background for mobile devices. Falls back to desktop video if not provided.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image (Desktop)",
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
      name: "mobileBackgroundImage",
      title: "Background Image (Mobile)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      description: "Optional background image for mobile devices.",
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
    defineField({
      name: "textPositionMobile",
      title: "Text Position (Mobile)",
      type: "string",
      description:
        "Position of text on mobile and tablet devices. Defaults to Middle Center.",
      options: {
        list: [
          { title: "Top Left", value: "top-left" },
          { title: "Top Center", value: "top-center" },
          { title: "Top Right", value: "top-right" },
          { title: "Middle Left", value: "middle-left" },
          { title: "Middle Center", value: "middle-center" },
          { title: "Middle Right", value: "middle-right" },
          { title: "Bottom Left", value: "bottom-left" },
          { title: "Bottom Center", value: "bottom-center" },
          { title: "Bottom Right", value: "bottom-right" },
        ],
      },
      initialValue: "middle-center",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textPositionDesktop",
      title: "Text Position (Desktop)",
      type: "string",
      description:
        "Position of text on desktop devices. Defaults to Bottom Left.",
      options: {
        list: [
          { title: "Top Left", value: "top-left" },
          { title: "Top Center", value: "top-center" },
          { title: "Top Right", value: "top-right" },
          { title: "Middle Left", value: "middle-left" },
          { title: "Middle Center", value: "middle-center" },
          { title: "Middle Right", value: "middle-right" },
          { title: "Bottom Left", value: "bottom-left" },
          { title: "Bottom Center", value: "bottom-center" },
          { title: "Bottom Right", value: "bottom-right" },
        ],
      },
      initialValue: "bottom-left",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      media: "backgroundImage",
    },
  },
});
