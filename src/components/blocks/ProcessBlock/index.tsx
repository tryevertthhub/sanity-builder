"use client";

import { useRef, useId } from "react";
import { motion, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type ProcessBlockProps = {
  _type: "processBlock";
  heading?: string;
  description?: string;
  steps?: {
    _key: string;
    title: string;
    description: string;
    icon: string;
  }[];
};

const StepIcon = ({
  icon,
  className,
  "aria-hidden": ariaHidden,
}: {
  icon: string;
  className?: string;
  "aria-hidden"?: boolean;
}) => {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon];
  return Icon ? (
    <Icon className={cn("w-6 h-6", className)} aria-hidden={ariaHidden} />
  ) : null;
};

export function ProcessBlock({
  heading = "Our Process",
  description = "We follow a proven methodology to deliver exceptional results",
  steps = [],
}: ProcessBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const headingId = useId();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black py-24 lg:py-32"
      aria-labelledby={headingId}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id={headingId}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-gray-200/80 via-white to-gray-200/80 bg-clip-text text-transparent">
              {heading}
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">{description}</p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative mt-16 sm:mt-20 lg:mt-24">
          {/* Vertical Line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-800 via-gray-700 to-transparent sm:left-1/2 sm:-ml-1"
            aria-hidden="true"
          />

          <ol className="relative space-y-8">
            {steps.map((step, index) => (
              <motion.li
                key={step._key}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={cn(
                  "relative flex items-start",
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
                  "gap-8 sm:gap-12"
                )}
              >
                {/* Step Number */}
                <div
                  className="absolute left-4 -translate-x-1/2 sm:left-1/2"
                  aria-hidden="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-800 bg-black text-sm font-semibold text-gray-300">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "ml-12 sm:ml-0 sm:w-1/2",
                    index % 2 === 0 ? "sm:pr-16" : "sm:pl-16"
                  )}
                >
                  <div className="group relative rounded-2xl border border-gray-800/50 bg-black/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:bg-black/40">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                        <StepIcon
                          icon={step.icon}
                          className="text-gray-300"
                          aria-hidden={true}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-gray-400">{step.description}</p>

                    {/* Decorative gradient */}
                    <div
                      className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-gray-800/5 via-gray-800/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
