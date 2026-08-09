interface Props {
  readonly className?: string;
  readonly ariaHidden?: boolean;
}

/** Bare leftward chevron - go back; rotate for other directions */
export default function ChevronLeftIcon({ className, ariaHidden }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
    </svg>
  );
}
