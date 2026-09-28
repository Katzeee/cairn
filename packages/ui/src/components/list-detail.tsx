import type { ReactNode } from "react";

import { Button } from "./button.js";
import { Icon } from "./icon.js";

export function ListDetail({
  list,
  detail,
  detailVisible,
  onBack,
  backLabel = "Back to list",
}: Readonly<{
  list: ReactNode;
  detail: ReactNode;
  detailVisible: boolean;
  onBack: () => void;
  backLabel?: string;
}>) {
  return (
    <div className="cairn-ListDetail" data-ui="list-detail">
      <div className="cairn-ListDetailGrid">
        <section aria-label="Items" className="cairn-ListDetailList" data-pane="list" data-visible={!detailVisible}>
          {list}
        </section>
        <section aria-label="Details" className="cairn-ListDetailPane" data-pane="detail" data-visible={detailVisible}>
          <div className="cairn-ListDetailBack">
            <Button onClick={onBack} size="sm" variant="ghost">
              <Icon name="arrow-left" size="sm" />
              {backLabel}
            </Button>
          </div>
          {detail}
        </section>
      </div>
    </div>
  );
}
