import { apiReference } from "../generated/api.js";
import type { ApiProperty } from "./api-reference-types.js";

export function ApiReference({ exports }: Readonly<{ exports: readonly string[] }>) {
  const names = exports.flatMap((name) => Object.keys(apiReference).filter((key) => key === name || key.startsWith(`${name}.`)));
  return names.map((name) => {
    const entry = apiReference[name]!;
    return (
      <section className="cairn-CatalogApi" data-api-component={name} key={name}>
        <header className="cairn-CatalogApiHeader">
          <h3 className="cairn-CatalogApiName">{name}</h3>
          <code className="cairn-CatalogApiEntry">{entry.entry}</code>
        </header>
        <PropsTable name={name} rows={entry.props} />
      </section>
    );
  });
}

function PropsTable({ rows, name }: Readonly<{ rows: readonly ApiProperty[]; name: string }>) {
  if (rows.length === 0) return <p className="cairn-CatalogMuted">Accepts the attributes of its native element.</p>;
  return (
    <div className="cairn-CatalogTableViewport" tabIndex={0}>
      <table className="cairn-CatalogTable">
        <caption className="cairn-VisuallyHidden">{name} properties</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th className="cairn-CatalogPropName" scope="row">
                <code>{row.name}</code>
                {row.required ? <span className="cairn-CatalogPropRequired">required</span> : null}
                {row.description ? <p className="cairn-CatalogPropDescription">{row.description}</p> : null}
              </th>
              <td>
                <PropType type={row.type} />
              </td>
              <td>{row.default === null ? <span aria-label="None">—</span> : <code>{row.default}</code>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropType({ type }: Readonly<{ type: string }>) {
  const members = unionMembers(type.replace(/ \| undefined$/u, ""));
  const full = members.join(" | ");
  if (members.length <= 6 && full.length <= 120) return <code className="cairn-CatalogPropType">{full}</code>;
  return (
    <details className="cairn-CatalogPropUnion">
      <summary>
        <code className="cairn-CatalogPropType">{`${members.slice(0, 3).join(" | ")} | …`}</code>
        <span className="cairn-CatalogMuted">{members.length > 6 ? `${members.length} values` : "Full type"}</span>
      </summary>
      <code className="cairn-CatalogPropType">{full}</code>
    </details>
  );
}

function unionMembers(type: string): string[] {
  const members: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < type.length; index++) {
    const character = type[index]!;
    if ("(<{[".includes(character)) depth++;
    else if (")>}]".includes(character)) depth--;
    else if (depth === 0 && type.startsWith(" | ", index)) {
      members.push(type.slice(start, index));
      start = index + 3;
    }
  }
  members.push(type.slice(start));
  return members;
}
