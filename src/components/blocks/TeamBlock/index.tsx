"use client";

import { Mail } from "lucide-react";
import { SanityImage } from "../../sanity-image";
import { motion, useInView } from "framer-motion";
import { useRef, useId } from "react";

type TeamMemberType = {
  _key?: string;
  name: string;
  credentials?: string;
  role: string;
  roleDescription?: string;
  email: string;
  specialties?: string[];
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
    hotspot?: {
      x: number;
      y: number;
    };
  };
};

type TeamBlockProps = {
  heading?: string;
  subheading?: string;
  description?: string;
  teamMembers?: TeamMemberType[];
};

const TeamMemberCard = ({ member }: { member: TeamMemberType }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm transition-all duration-300"
    >
      {/* Card Background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </motion.div>

      {/* Card Content */}
      <div className="relative p-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="aspect-square overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 ring-1 ring-gray-700"
        >
          {member.image ? (
            <SanityImage
              asset={member.image}
              alt={member.image.alt || `${member.name}'s profile photo`}
              width={800}
              height={800}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900"
              aria-hidden="true"
            />
          )}
        </motion.div>

        <div className="space-y-6">
          <div className="space-y-3">
            <motion.h3
              whileHover={{ x: 5 }}
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300"
            >
              {member.name}
            </motion.h3>
            <motion.p
              whileHover={{ x: 5 }}
              className="text-lg font-medium text-gray-400"
            >
              {member.role}
            </motion.p>
            {member.credentials && (
              <motion.ul
                className="flex flex-wrap gap-2 list-none p-0 m-0"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {member.credentials.split(", ").map((credential, index) => (
                  <motion.li
                    key={credential}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="inline-flex items-center rounded-md bg-gray-800/50 px-2.5 py-1 text-sm font-medium text-gray-300 ring-1 ring-gray-700"
                  >
                    {credential}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          {member.roleDescription && (
            <motion.p
              whileHover={{ x: 5 }}
              className="text-base text-gray-400 leading-relaxed"
            >
              {member.roleDescription}
            </motion.p>
          )}

          {member.specialties && member.specialties.length > 0 && (
            <motion.ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {member.specialties.map((specialty, index) => (
                <motion.li
                  key={specialty}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800/50 text-gray-300 ring-1 ring-gray-700 group-hover:ring-gray-600 transition-all duration-300"
                >
                  {specialty}
                </motion.li>
              ))}
            </motion.ul>
          )}

          <motion.a
            whileHover={{ x: 5 }}
            href={`mailto:${member.email}`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-all duration-200"
          >
            <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>{member.email}</span>
          </motion.a>
        </div>

        {/* Hover Effects */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-700 group-hover:ring-gray-600 transition-all duration-300"
        />
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-t from-gray-800/20 via-transparent to-transparent"
        />
      </div>
    </motion.div>
  );
};

export function TeamBlock({
  heading = "Leadership Team",
  subheading = "MEET OUR TEAM",
  description = "Our dedicated team brings together decades of experience in business and real estate law, providing strategic counsel and innovative solutions for our clients' most complex legal challenges.",
  teamMembers = [],
}: TeamBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const headingId = useId();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-24 sm:py-32 z-10"
      aria-labelledby={headingId}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-transparent rounded-full blur-3xl transform rotate-12 animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gray-800/30 via-gray-700/20 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-90">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl lg:max-w-4xl text-center mb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base font-semibold leading-7 text-gray-400 uppercase tracking-wider"
          >
            {subheading}
          </motion.p>
          <motion.h2
            id={headingId}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300"
          >
            {heading}
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-gray-400"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <div className="mx-auto grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 max-w-5xl relative z-[100]">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
