import SizeChartMannequin from "@/public/images/size-guide-mannequin.png";
import { sanityFetch } from "@/sanity/lib/live";
import { getAllSizesQuery } from "@/sanity/lib/products/getAllSizes";
import { Metadata } from "next";
import Image from "next/image";
import { BsInfoCircle } from "react-icons/bs";

interface Size {
  _id: string;
  label: string;
  slug: string;
  chestWidth: number | null;
  torsoLength: number | null;
  ageGroup: string | null;
  order: number | null;
}

export const metadata: Metadata = {
  title: "Size Guide | Ezio Kids",
  description:
    "Find the perfect fit for your little one with our comprehensive size guide.",
};

export const dynamic = "force-dynamic";

export default async function SizeGuidePage() {
  const { data: sizes } = await sanityFetch({
    query: getAllSizesQuery,
  });

  return (
    <main className="bg-neutral-50 min-h-screen pb-20 pt-14 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-zinc-500 font-bold tracking-wider uppercase text-sm mb-3 block">
            Ezio Kids
          </span>
          <h1 className="text-5xl md:text-7xl font-bebas text-zinc-900 tracking-wide leading-[0.9]">
            Size <span className="text-blue-main">Guide</span>
          </h1>
          <p className="mt-6 text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Use our size chart to find the perfect fit. Measurements are in
            centimeters.
          </p>
        </div>

        <Image
          src={SizeChartMannequin}
          alt="Size Chart Mannequin"
          width={240}
          height={240}
          className="mx-auto mb-12"
        />

        <div className="bg-white rounded-lg shadow-none overflow-hidden border border-zinc-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="py-4 px-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">
                    Chest Width
                    <span className="block text-xs font-normal text-zinc-400 capitalize mt-0.5">
                      Lebar Dada (cm)
                    </span>
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">
                    Torso Length
                    <span className="block text-xs font-normal text-zinc-400 capitalize mt-0.5">
                      Panjang Badan (cm)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sizes && sizes.length > 0 ? (
                  sizes.map((size: Size) => (
                    <tr
                      key={size._id}
                      className="hover:bg-zinc-50/50 transition-colors text-sm"
                    >
                      <td className="py-4 px-6 text-zinc-900 font-semibold">
                        {size.label}
                      </td>
                      <td className="py-4 px-6 text-zinc-600 font-medium font-mono">
                        {size.chestWidth ? `${size.chestWidth} cm` : "-"}
                      </td>
                      <td className="py-4 px-6 text-zinc-600 font-medium font-mono">
                        {size.torsoLength ? `${size.torsoLength} cm` : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-zinc-500 italic"
                    >
                      No size data available using current schema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg border border-blue-main/10 flex gap-4 items-start">
          <BsInfoCircle className="text-blue-main text-xl mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-main mb-2">How to measure</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              <strong>Chest Width:</strong> Measure the width from armpit to
              armpit.
              <br />
              <strong>Torso Length:</strong> Measure from the highest point of
              the shoulder down to the bottom hem.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
