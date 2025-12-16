import { type SchemaTypeDefinition } from "sanity";

import { journalType } from "./journal";
import orderType from "./order/orderType";
import salesType from "./order/salesType";
import { blockContentType } from "./other/blockContentType";
import { aboutPageType } from "./pages/aboutPageType";
import { accessibilityPageType } from "./pages/accessibilityPage";
import { catalogPageType } from "./pages/catalogPageType";
import { contactPageType } from "./pages/contactPage";
import { faqPageType } from "./pages/faqPage";
import landingPageType from "./pages/landingPageType";
import { privacyPageType } from "./pages/privacyPage";
import { termsPageType } from "./pages/termsPage";
import { categoryType } from "./product/categoryType";
import { collarTypeType } from "./product/collarTypeType";
import { collectionType } from "./product/collectionType";
import colorType from "./product/colorType";
import { fabricType } from "./product/fabricType";
import popularType from "./product/popularType";
import productType from "./product/productType";
import sizeType from "./product/sizeType";
import tagType from "./product/tagType";
import heroType from "./section/heroType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    productType,
    tagType,
    categoryType,
    collectionType,
    colorType,
    sizeType,
    fabricType,
    collarTypeType,
    orderType,
    salesType,
    landingPageType,
    heroType,
    popularType,
    journalType,
    catalogPageType,
    aboutPageType,
    contactPageType,
    termsPageType,
    privacyPageType,
    accessibilityPageType,
    faqPageType,
  ],
};
