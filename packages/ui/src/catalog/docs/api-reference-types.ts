export type ApiProperty = Readonly<{
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}>;

export type ApiEntry = Readonly<{
  entry: "@cairn/ui" | "@cairn/ui/editor";
  props: readonly ApiProperty[];
}>;

export type ApiReference = Readonly<Record<string, ApiEntry>>;
