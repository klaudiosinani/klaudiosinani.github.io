import type { FontStyle, FontWeight } from "satori";

export interface FontOptions {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
}
