import FabricSelection from "@/components/home/FabricSelection";
import LatestJournals from "@/components/home/LatestJournals";
import Hero from "@/components/landing/Hero";
import { getLandingPageContent } from "@/sanity/lib/landingPage/getLandingPageContent";

export default async function Home() {
  const landingPageContent = await getLandingPageContent();

  if (!landingPageContent || !landingPageContent.data) {
    return <></>;
  }

  return (
    <>
      <main
        aria-label="Homepage content"
        className="w-full flex flex-col overflow-x-hidden bg-background"
      >
        <Hero content={landingPageContent.data.hero} />
        <FabricSelection />
        <LatestJournals />
      </main>
    </>
  );
}
