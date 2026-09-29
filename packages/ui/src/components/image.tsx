import { Image as ImageGlyph, ImageOff } from "lucide-react";
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";

import { Icon } from "./icon.js";
import { customResponsive, type Responsive } from "./layout.js";

// Given by a container that draws the image edge to edge, such as Card.Media, which rounds it itself.
export const FlushMedia = createContext(false);

export type ImageFit = "cover" | "contain";

export type ImageProps = Readonly<{
  // Without a source the image shows its placeholder: the item has no picture.
  src?: string;
  // Describes the picture; an empty string marks it decorative.
  alt: string;
  // Width over height, such as "16/10". The space is held before the picture arrives.
  aspectRatio?: Responsive<string>;
  // Cover fills the frame and crops; contain shows the whole picture inside it.
  fit?: ImageFit;
  // Shown instead of the default icon when there is no picture or it failed to load.
  fallback?: ReactNode;
  loading?: "lazy" | "eager";
}>;

type Status = "empty" | "loading" | "loaded" | "error";

// A new source replaces the picture only once it has decoded, so a refreshed image never flashes its
// placeholder; a refresh that fails keeps the last picture that loaded.
export function Image({ src, alt, aspectRatio, fit = "cover", fallback, loading = "lazy" }: ImageProps) {
  const flush = useContext(FlushMedia);
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  if (src === undefined && loaded !== undefined) setLoaded(undefined);

  const status: Status =
    src === undefined ? "empty" : loaded !== undefined ? "loaded" : failed === src ? "error" : "loading";
  const style: Record<string, string> = {};
  const classes = ["cairn-Image", ...customResponsive("ar", aspectRatio, style)];
  const placeholder = status === "loaded" || status === "loading" ? null : (fallback ?? <Icon glyph={status === "error" ? ImageOff : ImageGlyph} size="lg" />);

  return (
    <span
      aria-label={status === "empty" || status === "error" ? alt || undefined : undefined}
      className={classes.join(" ")}
      data-fit={fit}
      data-flush={flush ? "" : undefined}
      data-ratio={aspectRatio === undefined ? undefined : ""}
      data-state={status}
      role={(status === "empty" || status === "error") && alt !== "" ? "img" : undefined}
      style={style as CSSProperties}
    >
      {src === undefined || status === "error" ? null : (
        <img
          alt={alt}
          className="cairn-ImagePicture"
          decoding="async"
          loading={loading}
          onError={() => {
            if (loaded === undefined) setFailed(src);
          }}
          onLoad={() => {
            if (loaded === undefined) setLoaded(src);
          }}
          src={loaded ?? src}
        />
      )}
      {src === undefined || loaded === undefined || src === loaded || failed === src ? null : (
        <img
          alt=""
          aria-hidden
          className="cairn-ImagePreload"
          decoding="async"
          hidden
          onError={() => setFailed(src)}
          onLoad={(event) => {
            event.currentTarget
              .decode()
              .catch(() => undefined)
              .then(() => setLoaded(src));
          }}
          src={src}
        />
      )}
      {placeholder === null ? null : <span className="cairn-ImagePlaceholder">{placeholder}</span>}
    </span>
  );
}
