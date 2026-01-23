// src/Components/Products/Button.tsx
import type { ButtonProps } from "@/Types/Product";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
  const sizes =
    size === "sm"
      ? "px-3 py-2 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-base"
      : "px-5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "bg-[color:var(--primary-color)] text-white shadow hover:opacity-95"
      : "border border-[color:var(--primary-color)] text-[color:var(--primary-color)] hover:bg-indigo-50";
  const disabledStyles = disabled ? "cursor-not-allowed opacity-60" : "";
  const cls = `${base} ${sizes} ${styles} ${disabledStyles} ${className}`.trim();

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={cls}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}