import { unstable_cache } from "next/cache";
import { detectNarratives } from "@/lib/intelligence/narrative-clusterer";
import { AnimatedHero } from "@/components/home/AnimatedHero";
import { AnimatedBento } from "@/components/home/AnimatedBento";
import { AnimatedCTA } from "@/components/home/AnimatedCTA";

const getCachedNarratives = unstable_cache(
  async () => {
    try {
      return await detectNarratives();
    } catch {
      return [];
    }
  },
  ["home-narratives"],
  { revalidate: 60 }
);

export default async function HomePage() {
  const narratives = await getCachedNarratives();

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center pb-16 sm:pb-0">
        {/* Orbs — GPU-promoted, paint once */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="orb-cyan absolute -top-24 -left-48 w-[600px] h-[600px]" />
          <div className="orb-violet absolute top-1/3 right-0 w-[400px] h-[400px]" />
          <div className="orb-emerald absolute bottom-0 left-1/3 w-[350px] h-[350px]" />
        </div>

        <AnimatedHero narratives={narratives} />
      </section>

      <AnimatedBento />
      <AnimatedCTA />
    </div>
  );
}
