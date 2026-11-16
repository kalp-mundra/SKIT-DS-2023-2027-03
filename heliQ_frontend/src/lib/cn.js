// Tiny helper to join conditional Tailwind class names.
// cn("p-4", isActive && "bg-brand-100", undefined) -> "p-4 bg-brand-100"
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
