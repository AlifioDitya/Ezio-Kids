import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ezio Kids")
    .items([
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("collection").title("Collections"),
      S.documentTypeListItem("color").title("Colors"),
      S.documentTypeListItem("size").title("Sizes"),
      S.documentTypeListItem("tag").title("Tags"),
      S.divider(),
    ]);
