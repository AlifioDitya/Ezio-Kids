import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery, PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export const metadata = {
  title: "Contact Us | Ezio Kids",
  description:
    "Get in touch with Ezio Kids. Visit our store or contact us for inquiries.",
};

export default async function ContactPage() {
  const CONTACT_PAGE_QUERY = defineQuery(`
    *[_type == "contactPage" && _id == "contactPageSingleton"][0]{
      title,
      storeImage,
      storeDescription,
      address,
      email,
      whatsapp,
      instagram,
      socialLinks[]{
        platform,
        url
      },
      mapImage
    }
  `);

  const { data } = await sanityFetch({ query: CONTACT_PAGE_QUERY });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Contact information not available.</p>
      </div>
    );
  }

  return (
    <main className="w-full bg-background text-foreground animate-in fade-in duration-500">
      {/* Header / Title Section */}
      <section className="pt-12 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-bebas tracking-wide uppercase mb-4">
          {data.title || "Contact Us"}
        </h1>
        <p className="max-w-xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          {data.storeDescription}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Landscape Store Image */}
        {data.storeImage && (
          <div className="relative aspect-[18/9] overflow-hidden rounded-sm bg-gray-100 shadow-md mb-16 md:mb-24">
            <Image
              src={urlFor(data.storeImage).url()}
              alt="Ezio Kids Store"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* LEFT COLUMN: Address & Map */}
          <div className="space-y-12">
            {/* Address */}
            <div>
              <h2 className="text-2xl font-bold font-bebas tracking-wide mb-6 border-b border-gray-200 pb-2">
                Visit Our Store
              </h2>
              <div className="prose prose-neutral prose-lg text-gray-700 leading-relaxed font-sans">
                <PortableText value={data.address} />
              </div>
            </div>

            {/* Map Snapshot */}
            {data.mapImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-gray-200 shadow-sm">
                <Image
                  src={urlFor(data.mapImage).url()}
                  alt="Location Map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors pointer-events-none" />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Contact Methods */}
          <div className="space-y-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold font-bebas tracking-wide mb-6 border-b border-gray-200 pb-2">
                Get In Touch
              </h2>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-gray-100 rounded-full text-neutral-800 group-hover:bg-neutral-800 group-hover:text-white transition-colors duration-300">
                    <MdOutlineEmail size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Email Us
                    </span>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-lg hover:underline underline-offset-4"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-gray-100 rounded-full text-neutral-800 group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
                    <FaWhatsapp size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg hover:underline underline-offset-4"
                    >
                      {data.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-gray-100 rounded-full text-neutral-800 group-hover:bg-[#E1306C] group-hover:text-white transition-colors duration-300">
                    <FaInstagram size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Instagram
                    </span>
                    <a
                      href={data.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg hover:underline underline-offset-4"
                    >
                      @eziokids.id
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Also Find Us On
                </h3>
                <div className="flex space-x-4">
                  {data.socialLinks.map(
                    (link: { _key: string; platform: string; url: string }) => (
                      <Link
                        key={link._key}
                        href={link.url}
                        target="_blank"
                        className="px-4 py-2 bg-gray-100 text-sm font-medium rounded-full hover:bg-neutral-800 hover:text-white transition-colors"
                      >
                        {link.platform}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
