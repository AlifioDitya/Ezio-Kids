// schemas/product.ts
import { IoShirtOutline } from "react-icons/io5";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: IoShirtOutline,

  fields: [
    // BASIC INFO
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // IMAGES & DESCRIPTION
    defineField({
      name: "mainImage",
      title: "Main Image",
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
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.min(10).max(500),
    }),
    defineField({
      name: "arrivalDate",
      title: "Arrival Date",
      type: "datetime",
      description: "When the product will be available for sale",
    }),

    // PRICING & TAGS
    defineField({
      name: "price",
      title: "Price (IDR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "tag" }],
        }),
      ],
    }),

    // TAXONOMIES
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "collection" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // VARIANTS: size × color → stock
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "reference",
              to: [{ type: "size" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "color",
              title: "Color",
              type: "reference",
              to: [{ type: "color" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "stock",
              title: "Stock",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              sizeLabel: "size.label",
              colorName: "color.name",
              stock: "stock",
            },
            prepare({ sizeLabel, colorName, stock }) {
              return {
                title: `${sizeLabel} / ${colorName}`,
                subtitle: `Stock: ${stock}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "mainImage",
      price: "price",
    },
    prepare({ title, media, price }) {
      const subtitle =
        typeof price === "number"
          ? `IDR ${price.toLocaleString()}`
          : "Price not set";
      return { title, subtitle, media };
    },
  },
});
