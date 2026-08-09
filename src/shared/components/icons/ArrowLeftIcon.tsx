interface Props {
  readonly className?: string;
  readonly ariaHidden?: boolean;
}

/** Leftward arrow with a tail - previous page, back */
export default function ArrowLeftIcon({ className, ariaHidden }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
    </svg>
  );
}
