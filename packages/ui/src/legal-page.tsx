import { fontNotices } from "@cairn/design-tokens";

import { Link } from "./components/link.js";

export function LegalPage({
  backHref = "#/",
  backLabel = "Return to application",
  embedded = false,
}: Readonly<{ backHref?: string; backLabel?: string; embedded?: boolean }>) {
  const Container = embedded ? "div" : "main";
  return (
    <Container className="mx-auto w-full max-w-240 px-6 pt-14 pb-20">
      <header className="border-b border-border pb-10">
        <span className="text-label font-medium">
          <Link href={backHref}>← {backLabel}</Link>
        </span>
        <p className="mt-12 mb-3 text-caption font-semibold tracking-widest text-muted-foreground uppercase">
          Legal & acknowledgements
        </p>
        <h1 className="text-page-title font-medium tracking-tight">Typography licenses</h1>
        <strong className="mt-4 block text-body text-muted-foreground">{fontNotices.harmonyOsSans.attribution}</strong>
      </header>
      <section className="pt-10">
        <h2 className="mb-4 text-title-small font-semibold">HarmonyOS Sans Fonts License Agreement</h2>
        <pre className="max-h-[60vh] overflow-auto rounded-md border border-border bg-card p-6 font-mono text-caption/relaxed whitespace-pre-wrap text-muted-foreground">
          {fontNotices.harmonyOsSans.license}
        </pre>
      </section>
      <section className="pt-10">
        <h2 className="mb-4 text-title-small font-semibold">JetBrains Mono Open Font License</h2>
        <strong className="mb-4 block text-body text-muted-foreground">{fontNotices.jetBrainsMono.attribution}</strong>
        <pre className="max-h-[60vh] overflow-auto rounded-md border border-border bg-card p-6 font-mono text-caption/relaxed whitespace-pre-wrap text-muted-foreground">
          {fontNotices.jetBrainsMono.license}
        </pre>
      </section>
    </Container>
  );
}
