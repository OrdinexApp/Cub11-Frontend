import { TemplateGrid } from "@/components/templates/TemplateGrid";

export const metadata = { title: "Templates · Cube11" };

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Templates</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          One tap to start. Curated with SEA + India creator contexts so preview visuals
          feel local, familiar, and conversion-ready.
        </p>
      </header>
      <TemplateGrid />
    </div>
  );
}
