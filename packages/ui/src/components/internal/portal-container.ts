import { useCallback, useState } from "react";

export function usePortalContainer() {
  const [container, setContainer] = useState<HTMLElement | undefined>();
  const anchorRef = useCallback((element: HTMLElement | null) => {
    setContainer(element?.closest<HTMLElement>("[data-cairn-theme]") ?? undefined);
  }, []);
  return { anchorRef, container };
}
