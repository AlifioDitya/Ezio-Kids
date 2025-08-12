// schemas/product.ts
import { IoShirtOutline } from "react-icons/io5";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: IoShirtOutline,
  fields: [
    // — BASIC INFO —
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

    // — CATEGORIZATION —
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sleeveLength",
      title: "Sleeve Length",
      type: "string",
      options: {
        list: [
          { title: "Short", value: "short" },
          { title: "Long", value: "long" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description:
        "It is best to limit each products to 2-3 tags to improve searchability.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),

    // — IMAGES & DESCRIPTION —
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
      name: "additionalImages",
      title: "Additional Images",
      type: "array",
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "blockContent",
      description: "E.g. machine wash cold, tumble dry low",
    }),

    // — AVAILABILITY & PRICING —
    defineField({
      name: "arrivalDate",
      title: "Arrival Date",
      type: "datetime",
      description: "When the product will be available for sale",
    }),
    defineField({
      name: "price",
      title: "Price (IDR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    // — VARIANTS: SIZE × COLOR → STOCK —
    defineField({
      name: "variants",
      title: "Variants (Size x Color)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
              description: "Stock Keeping Unit / identifier",
              validation: (Rule) => Rule.required().min(1),
            }),
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
              name: "priceOverride",
              title: "Price Override (IDR)",
              type: "number",
              description: "If this variant has a different price",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "stock",
              title: "Stock Quantity",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              size: "size.label",
              colorName: "color.name",
              colorImage: "color.swatch",
              stock: "stock",
            },
            prepare({ size, colorName, colorImage, stock }) {
              return {
                title: `${size} / ${colorName}`,
                subtitle: `Stock: ${stock}`,
                media: colorImage || null,
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
          ? `Rp ${price.toLocaleString()}`
          : "Price not set";
      return { title, subtitle, media };
    },
  },
});
