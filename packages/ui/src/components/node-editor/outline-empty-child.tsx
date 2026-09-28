import { OutlineBullet, OutlineBulletDot } from "./outline-bullet.js";

export function OutlineEmptyChild({
  onActivate,
  parentLabel,
  parentKey,
}: Readonly<{
  onActivate: () => void;
  parentLabel: string;
  parentKey: string | null;
}>) {
  return (
    <button
      aria-label={parentKey === null ? "Create node" : `Create child under ${parentLabel}`}
      className="cairn-OutlineEmptyChild"
      data-parent-key={parentKey ?? undefined}
      data-ui="outline-empty-child-placeholder"
      onClick={onActivate}
      onMouseDown={(event) => event.preventDefault()}
      tabIndex={-1}
      type="button"
    >
      <span className="cairn-OutlineEmptyBullet">
        <span
          className="cairn-OutlineEmptyMark"
        >
          <OutlineBullet>
            <OutlineBulletDot quiet />
          </OutlineBullet>
        </span>
      </span>
      <span aria-hidden className="cairn-OutlineEmptyBody">
        <span className="cairn-OutlineEmptyLine" />
      </span>
    </button>
  );
}
