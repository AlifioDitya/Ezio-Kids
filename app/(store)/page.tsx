import BestSeller from "@/components/landing/BestSeller";
import Hero from "@/components/landing/Hero";
import { NewArrival } from "@/components/landing/NewArrival";

export default function Home() {
  return (
    <>
      <main
        aria-label="Homepage content"
        className="mt-16 w-full flex flex-col overflow-x-hidden bg-background"
      >
        <Hero />
        <BestSeller />
        <NewArrival />
      </main>
    </>
  );
}
