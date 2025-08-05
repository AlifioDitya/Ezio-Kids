import { TbRosetteDiscount } from "react-icons/tb";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "sale",
  title: "Sale",
  type: "document",
  icon: TbRosetteDiscount,
  fields: [
    defineField({
      name: "title",
      title: "Sale Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Sale Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      description: "Amount off in percentage (e.g., 20 for 20%)",
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
    }),
    defineField({
      name: "validFrom",
      title: "Valid From",
      type: "datetime",
    }),
    defineField({
      name: "validUntil",
      title: "Valid Until",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Toggle to activate or deactivate the sale",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
    },
    prepare({ title, discountAmount, couponCode, isActive }) {
      const status = isActive ? "Active" : "Inactive";
      return {
        title,
        subtitle: `${discountAmount}% off - Code ${couponCode} - ${status}`,
      };
    },
  },
});
