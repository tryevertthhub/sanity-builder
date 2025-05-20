"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useId } from "react";
import { Scale, Users, Lightbulb } from "lucide-react";

import Link from "next/link";

export type WhyChooseBlockProps = {
  _type: "whyChooseBlock";
  heading?: string;
  description?: string;
  features?: {
    _key: string;
    title: string;
    description: string;
    icon: string;
    stats: {
      value: string;
      label: string;
    };
  }[];
  callToAction?: {
    heading: string;
    description: string;
    button: {
      label: string;
      link: {
        href: string;
        openInNewTab: boolean;
      };
    };
  };
};

const iconMap = {
  scale: Scale,
  users: Users,
  lightbulb: Lightbulb,
};

const FeatureIcon = ({ name, "aria-hidden": ariaHidden }: { name: string, "aria-hidden"?: boolean }) => {
  const Icon = iconMap[name as keyof typeof iconMap];
  return Icon ? <Icon className="h-8 w-8 text-primary" aria-hidden={ariaHidden} /> : null;
};

export function WhyChooseBlock({
  heading,
  description,
  features = [],
  callToAction,
}: WhyChooseBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const headingId = useId();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-24"
      aria-labelledby={heading ? headingId : undefined}
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            id={headingId}
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-100 py via-white to-gray-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            {heading}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-gray-400"
          >
            {description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature._key}
                variants={itemVariants}
                className="group relative rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80"
              >
                <div className="flex items-center gap-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                    <FeatureIcon name={feature.icon} aria-hidden={true} />
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-xl font-semibold leading-7 text-gray-200 group-hover:text-white">
                      {feature.title}
                    </dt>
                    {feature.stats && (
                      <div className="mt-1 flex items-center gap-x-2">
                        <span className="bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                          {feature.stats.value}
                        </span>
                        <span className="text-sm text-gray-500">
                          {feature.stats.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <dd className="mt-4 text-base leading-7 text-gray-500 group-hover:text-gray-400">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-24 max-w-3xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 sm:p-12"
          >
            <h3 className="bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              {callToAction?.heading}
            </h3>
            <p className="mt-4 text-lg text-gray-400">
              {callToAction?.description}
            </p>
            <div className="mt-8">
              <Link
                href={callToAction?.button.link.href || "#"}
                target={
                  callToAction?.button.link.openInNewTab ? "_blank" : "_self"
                }
                rel={callToAction?.button.link.openInNewTab ? "noopener noreferrer" : undefined}
                className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 text-base font-medium text-white shadow-lg shadow-black/20 transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-black/30"
              >
                {callToAction?.button.label}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
