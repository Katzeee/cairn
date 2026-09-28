import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactElement, ReactNode } from "react";

import type { ElementProps } from "./internal/element-props.js";
import { usePortalContainer } from "./internal/portal-container.js";
import type { ControlSize } from "./internal/variants.js";

export type DialogRootProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export type DialogContentProps = Readonly<{
  children: ReactNode;
  size?: ControlSize;
  align?: "start" | "center";
}>;

type Primitives = typeof BaseDialog | typeof BaseAlertDialog;

function contentFor(Base: Primitives) {
  return function Content({ children, size = "md", align = "center" }: DialogContentProps) {
    const { anchorRef, container } = usePortalContainer();
    return (
      <>
        <span hidden ref={anchorRef} />
        <Base.Portal container={container}>
          <Base.Backdrop className="cairn-DialogBackdrop" />
          <Base.Viewport className="cairn-DialogViewport" data-align={align}>
            <Base.Popup className="cairn-DialogContent" data-size={size}>
              {children}
            </Base.Popup>
          </Base.Viewport>
        </Base.Portal>
      </>
    );
  };
}

function Body(props: ElementProps<"div">) {
  return <div {...props} className="cairn-DialogBody" />;
}

function Actions(props: ElementProps<"div">) {
  return <div {...props} className="cairn-DialogActions" />;
}

export const Dialog = {
  Root: ({ children, ...props }: DialogRootProps) => <BaseDialog.Root {...props}>{children}</BaseDialog.Root>,
  Trigger: ({ children }: Readonly<{ children: ReactElement }>) => <BaseDialog.Trigger render={children} />,
  Content: contentFor(BaseDialog),
  Title: ({ children }: Readonly<{ children: ReactNode }>) => (
    <BaseDialog.Title className="cairn-DialogTitle">{children}</BaseDialog.Title>
  ),
  Description: ({ children }: Readonly<{ children: ReactNode }>) => (
    <BaseDialog.Description className="cairn-DialogDescription">{children}</BaseDialog.Description>
  ),
  Body,
  Actions,
  Close: ({ children }: Readonly<{ children: ReactElement }>) => <BaseDialog.Close render={children} />,
};

export const AlertDialog = {
  Root: ({ children, ...props }: DialogRootProps) => <BaseAlertDialog.Root {...props}>{children}</BaseAlertDialog.Root>,
  Trigger: ({ children }: Readonly<{ children: ReactElement }>) => <BaseAlertDialog.Trigger render={children} />,
  Content: contentFor(BaseAlertDialog),
  Title: ({ children }: Readonly<{ children: ReactNode }>) => (
    <BaseAlertDialog.Title className="cairn-DialogTitle">{children}</BaseAlertDialog.Title>
  ),
  Description: ({ children }: Readonly<{ children: ReactNode }>) => (
    <BaseAlertDialog.Description className="cairn-DialogDescription">{children}</BaseAlertDialog.Description>
  ),
  Body,
  Actions,
  Cancel: ({ children }: Readonly<{ children: ReactElement }>) => <BaseAlertDialog.Close render={children} />,
  Action: ({ children }: Readonly<{ children: ReactElement }>) => <BaseAlertDialog.Close render={children} />,
};
