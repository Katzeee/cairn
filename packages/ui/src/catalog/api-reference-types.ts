export type ApiProperty = Readonly<{
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}>;

export type ApiEntry = Readonly<{
  entry: "@cairn/ui" | "@cairn/ui/editor";
  source: string;
  signature: string;
  props: readonly ApiProperty[];
  inherited: readonly ApiProperty[];
  definitions: readonly Readonly<{ name: string; source: string }>[];
}>;

export type ApiReference = Readonly<Record<string, ApiEntry>>;
