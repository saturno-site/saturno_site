import CharacterGallery from "@/components/characters/CharacterGallery";

export const metadata = {
  title: "The 9 Enneagram Types — Saturno",
  description:
    "Explore all nine Enneagram personality types through geometric character art, archetypes, and deep insights.",
};

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#0f0720_0%,#1a0a2e_50%,#0d0d1a_100%)] text-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-display mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-saturno-300 to-fuchsia-400 bg-clip-text text-transparent">
              9 Archetypes
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Each Enneagram type is a unique lens on the world. Explore all nine
            — each with its own geometric character, cosmic archetype, and
            growth path.
          </p>
        </header>
        <CharacterGallery />
      </main>
    </div>
  );
}
