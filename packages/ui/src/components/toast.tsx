import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ReactNode } from "react";

import { Button, IconButton } from "./button.js";
import { Icon, type IconName } from "./icon.js";
import { usePortalContainer } from "./internal/portal-container.js";
import type { Tone } from "./internal/variants.js";

export type ToastOptions = Readonly<{
  title: string;
  description?: string;
  tone?: Tone;
  action?: Readonly<{ label: string; onPress: () => void }>;
}>;

type ToastData = Readonly<{ action?: ToastOptions["action"]; tone: Tone }>;

const manager = BaseToast.createToastManager<ToastData>();

const marks: Partial<Record<Tone, IconName>> = {
  info: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "circle-alert",
};

export function toast({ action, description, title, tone = "neutral" }: ToastOptions): string {
  return manager.add({
    actionProps: action === undefined ? undefined : { onClick: action.onPress },
    data: { action, tone },
    description,
    priority: tone === "danger" ? "high" : "low",
    title,
    type: tone,
  });
}

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <BaseToast.Provider limit={4} toastManager={manager}>
      {children}
      <span hidden ref={anchorRef} />
      <BaseToast.Portal container={container}>
        <BaseToast.Viewport className="cairn-ToastViewport">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>();
  return toasts.map((item) => {
    const data = item.data ?? { tone: "neutral" };
    const mark = marks[data.tone];
    return (
      <BaseToast.Root
        className="cairn-Toast"
        data-tone={data.tone}
        data-ui="toast"
        key={item.id}
        swipeDirection={["up", "right"]}
        toast={item}
      >
        <BaseToast.Content className="cairn-ToastContent" data-ui="toast-content">
          {mark === undefined ? null : (
            <span aria-hidden className="cairn-ToastMark">
              <Icon name={mark} size="sm" />
            </span>
          )}
          <div className="cairn-ToastText">
            <BaseToast.Title className="cairn-ToastTitle" />
            {item.description ? <BaseToast.Description className="cairn-ToastDescription" /> : null}
            {data.action === undefined ? null : (
              <div className="cairn-ToastAction">
                <BaseToast.Action render={<Button size="sm" variant="outline" />}>{data.action.label}</BaseToast.Action>
              </div>
            )}
          </div>
          <span className="cairn-ToastClose">
            <BaseToast.Close
              data-ui="toast-close"
              render={<IconButton aria-label="Dismiss notification" size="sm" variant="ghost" />}
            >
              <Icon name="x" size="sm" />
            </BaseToast.Close>
          </span>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}
