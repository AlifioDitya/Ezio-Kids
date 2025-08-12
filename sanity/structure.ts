import {
  FaBoxes,
  FaClipboardList,
  FaFileAlt,
  FaHome,
  FaList,
  FaPaintBrush,
  FaPercent,
  FaRulerHorizontal,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaThLarge,
  FaTshirt,
} from "react-icons/fa";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ezio Kids")
    .items([
      // ——— CATALOG SECTION ———
      S.listItem()
        .title("Catalog")
        .icon(FaBoxes)
        .child(
          S.list()
            .title("Catalog")
            .items([
              S.documentTypeListItem("product")
                .title("Products")
                .icon(FaTshirt),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(FaList),
              S.documentTypeListItem("collection")
                .title("Collections")
                .icon(FaThLarge),
              S.documentTypeListItem("color")
                .title("Colors")
                .icon(FaPaintBrush),
              S.documentTypeListItem("size")
                .title("Sizes")
                .icon(FaRulerHorizontal),
              S.documentTypeListItem("tag").title("Tags").icon(FaTag),
              S.listItem()
                .title("Popular Products")
                .icon(FaStar)
                .schemaType("popular")
                .child(
                  S.document()
                    .schemaType("popular")
                    .documentId("popularProductsSingleton")
                ),
            ])
        ),

      S.divider(),

      // ——— COMMERCE SECTION ———
      S.listItem()
        .title("Commerce")
        .icon(FaShoppingCart)
        .child(
          S.list()
            .title("Commerce")
            .items([
              S.documentTypeListItem("order")
                .title("Orders")
                .icon(FaClipboardList),
              S.documentTypeListItem("sale")
                .title("Sales / Discounts")
                .icon(FaPercent),
            ])
        ),

      S.divider(),

      // ——— PAGES SECTION ———
      S.listItem()
        .title("Pages")
        .icon(FaFileAlt)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Landing Page")
                .icon(FaHome)
                .schemaType("landingPage")
                .child(
                  S.document()
                    .schemaType("landingPage")
                    .documentId("landingPageSingleton")
                ),
            ])
        ),
    ]);
