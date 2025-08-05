import BestSeller from "@/components/landing/BestSeller";
import Hero from "@/components/landing/Hero";
import { NewArrival } from "@/components/landing/NewArrival";
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
        className="mt-16 w-full flex flex-col overflow-x-hidden bg-background"
      >
        <Hero content={landingPageContent.data.hero} />
        <BestSeller />
        <NewArrival />
      </main>
    </>
  );
}
