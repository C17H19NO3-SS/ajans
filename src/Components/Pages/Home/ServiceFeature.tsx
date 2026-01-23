import { Link } from "react-router";
import { FadeIn, FadeInItem, FadeInStagger } from "@/Components/Common/Motion";

export type ServiceFeatureProps = {
  index: number;
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  to: string;
  image: string;
  imageBadge: string; // small chip text on image
  imageLabel: string; // label next to chip
  reverse?: boolean; // image left, text right
};

export function ServiceFeature({
  index,
  title,
  description,
  bullets,
  ctaText,
  to,
  image,
  imageBadge,
  imageLabel,
  reverse,
}: ServiceFeatureProps) {
  const idx = String(index).padStart(2, "0");
  return (
    <FadeInStagger className="grid items-center gap-10 lg:grid-cols-2" stagger={0.15}>
      {/* Image */}
      <FadeIn
        className={reverse ? "order-1" : "order-2 lg:order-2"}
        distance={24}
        direction={reverse ? "right" : "left"}
      >
        <div className="relative overflow-hidden rounded-lg shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="inline-flex items-center justify-center rounded-md bg-[rgba(59,90,187,0.95)] px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide">
                {imageBadge}
              </span>
              <span className="text-[0.95rem]">{imageLabel}</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Text */}
      <FadeIn
        className={reverse ? "order-2" : "order-1 lg:order-1"}
        distance={24}
        direction={reverse ? "left" : "right"}
        delay={0.05}
      >
        <FadeInStagger className="space-y-6" stagger={0.12}>
          <FadeInItem className="flex items-center gap-4">
            <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-[rgba(59,90,187,0.12)] text-[color:var(--primary-color)] font-extrabold shadow-[0_10px_25px_rgba(59,90,187,0.25)]">
              {idx}
            </span>
            <div>
              <h3 className="text-[1.9rem] font-extrabold text-[color:var(--secondary-color)]">
                {title}
              </h3>
              <div className="mt-2 h-[4px] w-[52px] rounded bg-[color:var(--primary-color)]" />
            </div>
          </FadeInItem>

          <FadeInItem as="p" className="text-[color:var(--text-light)] leading-[1.8]">
            {description}
          </FadeInItem>

          <FadeInStagger as="ul" className="space-y-3" stagger={0.08}>
            {bullets.map((b, i) => (
              <FadeInItem key={i} as="li" className="flex items-start gap-3" distance={10}>
                <i className="fas fa-circle-check text-[color:var(--primary-color)] mt-[2px]" />
                <span className="text-[0.98rem] text-[color:var(--text-color)]">{b}</span>
              </FadeInItem>
            ))}
          </FadeInStagger>

          <FadeInItem>
            <Link to={to} className="btn btn-primary">
              {ctaText}
            </Link>
          </FadeInItem>
        </FadeInStagger>
      </FadeIn>
    </FadeInStagger>
  );
}

export default ServiceFeature;
