"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import React, { useState } from "react";
import { InlineEdit } from "@/src/components/shared/InlineEdit";

export type ContactBlockProps = {
  _type: "contactBlock";
  sectionHeading?: string;
  title?: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  formConfig?: {
    heading: string;
    description: string;
    buttonText: string;
    successMessage: string;
    emailTo: string;
  };
  backgroundImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
};

export function ContactBlock({
  sectionHeading = "GET IN TOUCH",
  title = "Let's Start a Conversation",
  subtitle = "Every inquiry is a priority - please describe your situation.",
  phone = "503.877.4135",
  email = "garrett@cascadebusinesslaw.com",
  formConfig = {
    heading: "Send Us a Message",
    description:
      "Fill out the form below and we'll get back to you promptly. Your business matters to us.",
    buttonText: "Send Message",
    successMessage:
      "Thank you for reaching out! We'll be in touch with you shortly.",
    emailTo: "garrett@cascadebusinesslaw.com",
  },
  backgroundImage,
  onEdit,
}: ContactBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleFormConfigField = (field: string, value: any) => {
    if (!onEdit) return;
    onEdit("formConfig", { ...formConfig, [field]: value });
  };

  // Provide defaults for all formConfig fields to avoid linter errors
  const safeFormConfig = {
    heading: formConfig.heading || "Send Us a Message",
    description:
      formConfig.description ||
      "Fill out the form below and we'll get back to you promptly. Your business matters to us.",
    buttonText: formConfig.buttonText || "Send Message",
    successMessage:
      formConfig.successMessage ||
      "Thank you for reaching out! We'll be in touch with you shortly.",
    emailTo: formConfig.emailTo || "garrett@cascadebusinesslaw.com",
  };

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
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-16 sm:py-24 lg:py-32"
      aria-labelledby="contact-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      {backgroundImage && (
        <motion.div style={{ opacity }} className="absolute inset-0 -z-20">
          <Image
            src={backgroundImage.asset.url}
            alt={backgroundImage.alt || ""}
            fill
            className="object-cover opacity-15 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8 z-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-base font-semibold uppercase tracking-wide text-gray-400"
          >
            {onEdit ? (
              <InlineEdit
                value={sectionHeading}
                onChange={(val) => handleField("sectionHeading", val)}
                fieldName="sectionHeading"
                as="span"
                className="inline-block"
                inputClassName="text-base font-semibold uppercase tracking-wide text-gray-400 bg-transparent"
              />
            ) : (
              <span className="inline-block">{sectionHeading}</span>
            )}
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className={`mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl min-h-[2.5em] flex items-center justify-center ${title && title.trim() ? "bg-gradient-to-r from-gray-200/80 via-white to-gray-200/80 bg-clip-text text-transparent" : ""}`}
            id="contact-heading"
          >
            {onEdit ? (
              <InlineEdit
                value={title}
                onChange={(val) => handleField("title", val)}
                fieldName="title"
                as="span"
                className={`inline-block ${!title || !title.trim() ? "text-gray-500/60 italic" : ""}`}
                inputClassName="text-4xl font-bold tracking-tight bg-transparent text-white"
                multiline
              >
                {(title && title.trim()) || (
                  <span className="text-gray-500/60 italic">
                    Click to edit title
                  </span>
                )}
              </InlineEdit>
            ) : (
              <span
                className={`inline-block ${!title || !title.trim() ? "text-gray-500/60 italic" : ""}`}
              >
                {title && title.trim()}
              </span>
            )}
          </motion.h2>
          {onEdit && subtitle && (
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg leading-8 text-gray-400"
            >
              <InlineEdit
                value={subtitle}
                onChange={(val) => handleField("subtitle", val)}
                fieldName="subtitle"
                as="span"
                className="inline-block"
                inputClassName="text-lg leading-8 bg-transparent text-gray-400"
                multiline
              />
            </motion.p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-12 lg:mt-16 lg:grid-cols-2 lg:gap-y-16"
        >
          {/* Direct Contact Info */}
          <motion.div variants={itemVariants}>
            <motion.div variants={containerVariants} className="space-y-8">
              <motion.div
                variants={itemVariants}
                className="group relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80"
              >
                {/* Decorative corner gradients */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent"
                />

                <motion.div className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-4"
                  >
                    <div
                      className="rounded-lg bg-gray-800/50 p-2"
                      aria-hidden="true"
                    >
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-gray-400"
                        id="phone-label"
                      >
                        Phone
                      </p>
                      <a
                        href={`tel:${phone}`}
                        className="text-sm lg:text-lg font-semibold text-white transition-colors duration-200 hover:text-primary break-all"
                        aria-labelledby="phone-label"
                      >
                        {onEdit ? (
                          <InlineEdit
                            value={phone}
                            onChange={(val) => handleField("phone", val)}
                            fieldName="phone"
                            as="span"
                            className="inline-block"
                            inputClassName="text-sm lg:text-lg font-semibold text-white bg-transparent"
                          />
                        ) : (
                          <span className="inline-block">{phone}</span>
                        )}
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-4"
                  >
                    <div
                      className="rounded-lg bg-gray-800/50 p-2"
                      aria-hidden="true"
                    >
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-gray-400"
                        id="email-label"
                      >
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm lg:text-lg font-semibold text-white transition-colors duration-200 hover:text-primary break-all"
                        aria-labelledby="email-label"
                      >
                        {onEdit ? (
                          <InlineEdit
                            value={email}
                            onChange={(val) => handleField("email", val)}
                            fieldName="email"
                            as="span"
                            className="inline-block"
                            inputClassName="text-sm lg:text-lg font-semibold text-white bg-transparent"
                          />
                        ) : (
                          <span className="inline-block">{email}</span>
                        )}
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            className="relative rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 sm:p-10"
          >
            <motion.div
              variants={itemVariants}
              className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gray-800/5 via-gray-800/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <motion.h3
              variants={itemVariants}
              className="text-lg font-semibold leading-8 text-white"
              id="contact-form-heading"
            >
              {onEdit ? (
                <InlineEdit
                  value={safeFormConfig.heading}
                  onChange={(val) => handleFormConfigField("heading", val)}
                  fieldName="formConfig.heading"
                  as="span"
                  className="inline-block"
                  inputClassName="text-lg font-semibold leading-8 text-white bg-transparent"
                />
              ) : (
                <span className="inline-block">{safeFormConfig.heading}</span>
              )}
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="mt-2 text-sm leading-6 text-gray-400"
            >
              {onEdit ? (
                <InlineEdit
                  value={safeFormConfig.description}
                  onChange={(val) => handleFormConfigField("description", val)}
                  fieldName="formConfig.description"
                  as="span"
                  className="inline-block"
                  inputClassName="text-sm leading-6 text-gray-400 bg-transparent"
                  multiline
                />
              ) : (
                <span className="inline-block">
                  {safeFormConfig.description}
                </span>
              )}
            </motion.p>

            <motion.form
              variants={containerVariants}
              className="mt-8 space-y-6 relative z-0"
              action="#"
              method="blog"
              aria-labelledby="contact-form-heading"
              noValidate
            >
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                  id="name-label"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-2 block w-full rounded-md border-0 bg-gray-800/50 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-gray-700/50 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Your name"
                  aria-required="true"
                  aria-describedby="name-label"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                  id="email-input-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-2 block w-full rounded-md border-0 bg-gray-800/50 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-gray-700/50 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-describedby="email-input-label"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300"
                  id="message-label"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="mt-2 block w-full rounded-md border-0 bg-gray-800/50 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-gray-700/50 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="How can we help you?"
                  aria-required="true"
                  aria-describedby="message-label"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Submit Button Text
                </label>
                {onEdit ? (
                  <InlineEdit
                    value={safeFormConfig.buttonText}
                    onChange={(val) => handleFormConfigField("buttonText", val)}
                    fieldName="formConfig.buttonText"
                    as="span"
                    className="inline-block text-base font-semibold text-blue-400"
                    inputClassName="text-base font-semibold text-blue-400 bg-transparent"
                  />
                ) : (
                  <span className="inline-block text-base font-semibold text-blue-400">
                    {safeFormConfig.buttonText}
                  </span>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Success Message
                </label>
                {onEdit ? (
                  <InlineEdit
                    value={safeFormConfig.successMessage}
                    onChange={(val) =>
                      handleFormConfigField("successMessage", val)
                    }
                    fieldName="formConfig.successMessage"
                    as="span"
                    className="inline-block text-sm text-gray-400"
                    inputClassName="text-sm text-gray-400 bg-transparent"
                    multiline
                  />
                ) : (
                  <span className="inline-block text-sm text-gray-400">
                    {safeFormConfig.successMessage}
                  </span>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Form Recipient Email
                </label>
                {onEdit ? (
                  <InlineEdit
                    value={safeFormConfig.emailTo}
                    onChange={(val) => handleFormConfigField("emailTo", val)}
                    fieldName="formConfig.emailTo"
                    as="span"
                    className="inline-block text-sm text-blue-400"
                    inputClassName="text-sm text-blue-400 bg-transparent"
                  />
                ) : (
                  <span className="inline-block text-sm text-blue-400">
                    {safeFormConfig.emailTo}
                  </span>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 text-base font-medium text-white shadow-lg shadow-black/20 transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-black/30"
                  aria-label={safeFormConfig.buttonText}
                >
                  {safeFormConfig.buttonText}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
