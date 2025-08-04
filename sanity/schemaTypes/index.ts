import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./product/categoryType";
import { collectionType } from "./product/collectionType";
import colorType from "./product/colorType";
import productType from "./product/productType";
import sizeType from "./product/sizeType";
import tagType from "./product/tagType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productType,
    tagType,
    categoryType,
    collectionType,
    colorType,
    sizeType,
  ],
};
