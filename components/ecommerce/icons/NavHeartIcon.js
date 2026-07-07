// Outlined to match the thin-line style of Home/Cart/Profile — the original
// heart you sent was a solid-fill shape, a different visual weight from the
// rest of the set. This uses the same stroke width/rounded caps as the others.
export default function NavHeartIcon({ size = 24, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.25C12 20.25 3.75 15.5 3.75 9.75C3.75 6.85051 6.10051 4.5 9 4.5C10.3062 4.5 11.5 5 12 6C12.5 5 13.6938 4.5 15 4.5C17.8995 4.5 20.25 6.85051 20.25 9.75C20.25 15.5 12 20.25 12 20.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
