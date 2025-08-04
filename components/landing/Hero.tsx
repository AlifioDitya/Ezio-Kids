"use client";

import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section
      aria-label="Featured products journey"
      className="flex flex-col w-full sm:h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* Desktop layout */}
      <div className="hidden sm:flex flex-1 overflow-hidden">
        {/* Left image */}
        <div className="flex-1 relative">
          <Image
            src="/images/left-image.jpg"
            alt="Smiling children wearing stylish outfits outdoors"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Center panel */}
        <div className="flex-1 relative flex items-center justify-center bg-[#FAF6F0] p-6 overflow-hidden">
          <div
            className="
              relative z-10 text-center 
              w-full px-4 sm:px-6 md:px-8 lg:px-0 
              max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
              mx-auto
            "
          >
            <h1
              className="
                font-bold 
                text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                text-[#495378] leading-tight
              "
            >
              Fashion for Every Playground
            </h1>
            <p
              className="
                mt-8 
                font-semibold 
                text-base sm:text-lg md:text-xl lg:text-2xl 
                text-[#495378]
              "
            >
              Discover the latest trends!
            </p>
            <Link
              href="/shop"
              aria-label="Shop Fashion for Every Playground"
              className="
                mt-8 inline-block 
                px-6 py-3 sm:px-8 sm:py-4 
                bg-[#E32C3E]/80 hover:bg-white 
                text-white hover:text-red-500 
                font-bold rounded-sm transition 
                text-base sm:text-lg md:text-xl
                whitespace-nowrap
              "
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 relative">
          <Image
            src="/images/right-image.jpg"
            alt="Assorted kids’ outfits displayed colorfully"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Mobile layout */}
      {/* Mobile layout */}
      <div className="sm:hidden flex flex-row h-[50vh] overflow-hidden">
        <div className="flex-1 relative">
          <Image
            src="/images/left-image.jpg"
            alt="Kids in playful outfits"
            fill
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="flex-1 relative">
          <Image
            src="/images/right-image.jpg"
            alt="Brightly colored children's clothing"
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      {/* Mobile CTA panel */}
      <div className="sm:hidden bg-[#FAF6F0] p-6">
        <h1 className="text-center font-bold text-2xl text-[#495378]">
          Fashion for Every Playground
        </h1>
        <p className="mt-2 text-center font-semibold text-base text-[#495378]">
          Discover the latest trends!
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/shop"
            aria-label="Shop Fashion for Every Playground"
            className="
              px-6 py-3 
              bg-[#E32C3E]/80 hover:bg-white 
              text-white hover:text-red-500 
              font-bold rounded-sm transition text-lg
            "
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
