/**
 * The mobile hamburger
 */
export default function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="menu-icon"
    >
      <line x1="7" y1="12" x2="21" y2="12" className="line"></line>
      <line x1="3" y1="6" x2="21" y2="6" className="line"></line>
      <line x1="12" y1="18" x2="21" y2="18" className="line"></line>
      <line x1="18" y1="6" x2="6" y2="18" className="close"></line>
      <line x1="6" y1="6" x2="18" y2="18" className="close"></line>
    </svg>
  );
}
