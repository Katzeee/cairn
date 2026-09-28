import { fontNotices } from "@cairn/design-tokens";

import { Icon } from "./icon.js";
import { Link } from "./link.js";

export function LegalPage({
  backHref = "#/",
  backLabel = "Return to application",
  embedded = false,
}: Readonly<{ backHref?: string; backLabel?: string; embedded?: boolean }>) {
  const Container = embedded ? "div" : "main";
  return (
    <Container className="cairn-LegalPage">
      <header className="cairn-LegalHeader">
        {embedded ? null : (
          <span className="cairn-LegalBack">
            <Link href={backHref} underline="hover">
              <Icon name="arrow-left" size="xs" /> {backLabel}
            </Link>
          </span>
        )}
        <p className="cairn-LegalEyebrow">Legal & acknowledgements</p>
        <h1 className="cairn-LegalTitle">Typography licenses</h1>
        <strong className="cairn-LegalAttribution">{fontNotices.harmonyOsSans.attribution}</strong>
      </header>
      <section className="cairn-LegalSection">
        <h2 className="cairn-LegalSectionTitle">HarmonyOS Sans Fonts License Agreement</h2>
        <pre className="cairn-LegalLicense cairn-Focusable" tabIndex={0}>
          {fontNotices.harmonyOsSans.license}
        </pre>
      </section>
      <section className="cairn-LegalSection">
        <h2 className="cairn-LegalSectionTitle">JetBrains Mono Open Font License</h2>
        <strong className="cairn-LegalAttribution">{fontNotices.jetBrainsMono.attribution}</strong>
        <pre className="cairn-LegalLicense cairn-Focusable" tabIndex={0}>
          {fontNotices.jetBrainsMono.license}
        </pre>
      </section>
    </Container>
  );
}
