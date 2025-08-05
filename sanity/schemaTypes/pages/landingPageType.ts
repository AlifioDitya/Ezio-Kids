import { FaHome } from "react-icons/fa";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  description:
    "Main entry point for the website, featuring the hero section and other content. Only a single landing page is allowed.",
  icon: FaHome,

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // embed exactly one Hero Section
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSection",
      validation: (Rule) => Rule.required(),
    }),

    // placeholder for future additional sections
    // defineField({
    //   name: 'sections',
    //   title: 'Additional Sections',
    //   type: 'array',
    //   of: [
    //     {type: 'testimonialSection'},
    //     {type: 'newsletterSignup'},
    //     // …etc…
    //   ],
    // }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "hero.heading",
      media: "hero.backgroundImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
