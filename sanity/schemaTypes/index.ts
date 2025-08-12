import { type SchemaTypeDefinition } from "sanity";

import orderType from "./order/orderType";
import salesType from "./order/salesType";
import { blockContentType } from "./other/blockContentType";
import landingPageType from "./pages/landingPageType";
import { categoryType } from "./product/categoryType";
import { collectionType } from "./product/collectionType";
import colorType from "./product/colorType";
import productType from "./product/productType";
import sizeType from "./product/sizeType";
import tagType from "./product/tagType";
import heroType from "./section/heroType";
import popularType from "./product/popularType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    productType,
    tagType,
    categoryType,
    collectionType,
    colorType,
    sizeType,
    orderType,
    salesType,
    landingPageType,
    heroType,
    popularType,
  ],
};
