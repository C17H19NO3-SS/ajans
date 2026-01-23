import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];
const DEFAULT_VIEWPORT = { once: true, amount: 0.25, margin: "-80px 0px -80px" } as const;

type Direction = "up" | "down" | "left" | "right" | "none";

type MotionElement = keyof typeof motionElements;

const motionElements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
  li: motion.li,
  details: motion.details,
  span: motion.span,
  a: motion.a,
  p: motion.p,
  h2: motion.h2,
};

const directionOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
};

const resolveMotionComponent = (as: MotionElement | undefined) => {
  if (!as) return motion.div;
  return motionElements[as] ?? motion.div;
};

type TriggerMode = "viewport" | "load";

type CommonMotionProps = {
  as?: MotionElement;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
} & Record<string, unknown>;

type FadeInBaseProps = CommonMotionProps & {
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  trigger?: TriggerMode;
};

export function FadeIn({
  as = "div",
  children,
  delay = 0,
  duration = 0.6,
  distance = 24,
  direction = "up",
  trigger = "viewport",
  className,
  ...rest
}: FadeInBaseProps) {
  const MotionComponent = resolveMotionComponent(as);
  const offset = directionOffset(direction, distance);
  const initial = { opacity: 0, ...offset };
  const animateTarget = { opacity: 1, x: 0, y: 0 };
  const transition: Transition = { duration, delay, ease: EASE };

  if (trigger === "load") {
    return (
      <MotionComponent
        initial={initial}
        animate={animateTarget}
        transition={transition}
        className={className}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial={initial}
      whileInView={animateTarget}
      viewport={DEFAULT_VIEWPORT}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

type FadeInStaggerProps = CommonMotionProps & {
  stagger?: number;
  delay?: number;
  trigger?: TriggerMode;
};

export function FadeInStagger({
  as = "div",
  children,
  stagger = 0.12,
  delay = 0,
  trigger = "viewport",
  className,
  ...rest
}: FadeInStaggerProps) {
  const MotionComponent = resolveMotionComponent(as);
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  if (trigger === "load") {
    return (
      <MotionComponent
        variants={variants}
        initial="hidden"
        animate="visible"
        className={className}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

type FadeInItemTrigger = "parent" | "viewport" | "load";

type FadeInItemProps = CommonMotionProps & {
  duration?: number;
  delay?: number;
  distance?: number;
  direction?: Direction;
  trigger?: FadeInItemTrigger;
};

export function FadeInItem({
  as = "div",
  children,
  duration = 0.55,
  delay = 0,
  distance = 20,
  direction = "up",
  trigger = "parent",
  className,
  ...rest
}: FadeInItemProps) {
  const MotionComponent = resolveMotionComponent(as);
  const offset = directionOffset(direction, distance);
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE, delay },
    },
  };

  if (trigger === "load") {
    return (
      <MotionComponent
        variants={variants}
        initial="hidden"
        animate="visible"
        className={className}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  if (trigger === "viewport") {
    return (
      <MotionComponent
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={DEFAULT_VIEWPORT}
        className={className}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent variants={variants} className={className} {...rest}>
      {children}
    </MotionComponent>
  );
}

type PageTransitionProps = CommonMotionProps;

export function PageTransition({ children, className, ...rest }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.4, ease: EASE } }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export { AnimatePresence } from "framer-motion";
