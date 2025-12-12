import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getLandingPageContent = async () => {
  const LANDING_PAGE_QUERY = defineQuery(
    `*[_type == "landingPage" && _id == "landingPageSingleton"][0]{
      ...,
      hero {
        ...,
        backgroundVideo {
          asset->{
            url
          }
        },
        mobileBackgroundVideo {
          asset->{
            url
          }
        }
      }
    }`
  );

  const landingPageContent = await sanityFetch({
    query: LANDING_PAGE_QUERY,
  });

  return landingPageContent || {};
};
