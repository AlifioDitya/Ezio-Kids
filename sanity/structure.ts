import {
  FaBook,
  FaBoxes,
  FaFileAlt,
  FaFileContract,
  FaHome,
  FaList,
  FaPaintBrush,
  FaQuestionCircle,
  FaRulerHorizontal,
  FaStar,
  FaTag,
  FaThLarge,
  FaTshirt,
  FaUniversalAccess,
  FaUserShield,
} from "react-icons/fa";
import { GiRolledCloth } from "react-icons/gi";
import { IoShirtOutline } from "react-icons/io5";
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
              S.documentTypeListItem("fabric")
                .title("Fabrics")
                .icon(GiRolledCloth),
              S.documentTypeListItem("collarType")
                .title("Collar Types")
                .icon(IoShirtOutline),
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
              S.listItem()
                .title("Catalog Page")
                .icon(FaBoxes)
                .schemaType("catalogPage")
                .child(
                  S.document()
                    .schemaType("catalogPage")
                    .documentId("catalogPageSingleton")
                ),
              S.listItem()
                .title("About Page")
                .icon(FaFileAlt)
                .schemaType("aboutPage")
                .child(
                  S.document()
                    .schemaType("aboutPage")
                    .documentId("aboutPageSingleton")
                ),
              S.listItem()
                .title("Contact Page")
                .icon(FaFileAlt)
                .schemaType("contactPage")
                .child(
                  S.document()
                    .schemaType("contactPage")
                    .documentId("contactPageSingleton")
                ),
              S.listItem()
                .title("Terms & Conditions")
                .icon(FaFileContract)
                .schemaType("termsPage")
                .child(
                  S.document()
                    .schemaType("termsPage")
                    .documentId("termsPageSingleton")
                ),
              S.listItem()
                .title("Privacy Policy")
                .icon(FaUserShield)
                .schemaType("privacyPage")
                .child(
                  S.document()
                    .schemaType("privacyPage")
                    .documentId("privacyPageSingleton")
                ),
              S.listItem()
                .title("Accessibility Statement")
                .icon(FaUniversalAccess)
                .schemaType("accessibilityPage")
                .child(
                  S.document()
                    .schemaType("accessibilityPage")
                    .documentId("accessibilityPageSingleton")
                ),
              S.listItem()
                .title("FAQ")
                .icon(FaQuestionCircle)
                .schemaType("faqPage")
                .child(
                  S.document()
                    .schemaType("faqPage")
                    .documentId("faqPageSingleton")
                ),
              S.documentTypeListItem("journal").title("Journal").icon(FaBook),
            ])
        ),
    ]);
