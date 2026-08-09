import type { ReactNode } from "react";

interface Props {
  readonly label: string;
  readonly children: ReactNode;
}

export default function LabeledItem({ label, children }: Props) {
  return (
    <h3 className="text-base">
      <span className="opacity-80">{label}: </span>
      {children}
    </h3>
  );
}
