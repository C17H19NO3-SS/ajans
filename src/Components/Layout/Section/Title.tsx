// src/Components/Products/SectionTitle.tsx
export default function SectionTitle({
  icon,
  title1,
  title2,
  subtitle,
  center = true,
}: {
  icon?: string;
  title1: string;
  title2?: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mb-12 text-center" : "mb-8"}>
      {icon && (
        <span className="mb-3 inline-grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-indigo-600 shadow">
          <i className={icon} />
        </span>
      )}
      <h2 className="text-2xl font-extrabold text-[color:var(--secondary-color)] md:text-3xl">
        {title1}{" "}
        {title2 && (
          <span className="text-[color:var(--primary-color)]">{title2}</span>
        )}
      </h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
  );
}
