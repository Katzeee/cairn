import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  window.addEventListener("blur", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    window.removeEventListener("blur", onChange);
  };
}

// Whether the window has focus, so window chrome can dim with the system's own controls.
export function useWindowActive(): boolean {
  return useSyncExternalStore(subscribe, () => document.hasFocus(), () => true);
}
