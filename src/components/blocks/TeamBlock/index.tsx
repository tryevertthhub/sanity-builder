"use client";

import { Mail } from "lucide-react";
import { SanityImage } from "../../sanity-image";
import { motion, useInView } from "framer-motion";
import { useRef, useId } from "react";
import React, { useState } from "react";

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

const InlineEdit = ({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
}: {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  React.useEffect(() => {
    setTemp(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (temp !== value) onChange(temp);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            } else if (e.key === "Escape") {
              setEditing(false);
              setTemp(value);
            }
          }}
          className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-2 w-full resize-vertical font-inherit focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
          style={{ minHeight: 40, width: "100%" }}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          else if (e.key === "Escape") {
            setEditing(false);
            setTemp(value);
          }
        }}
        className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
        style={{ minWidth: 80 }}
      />
    );
  }

  const Tag = as;
  return (
    <span
      className={`relative group/inline-edit ${className} px-1 py-0.5 rounded transition-all duration-150 hover:bg-blue-400/10 focus-within:bg-blue-400/10`}
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setEditing(true);
      }}
      role="button"
      aria-label={`Edit ${fieldName}`}
      title={`Edit ${fieldName}`}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      <Tag className="inline-edit-value font-semibold tracking-tight">
        {children || value}
      </Tag>
      <span className="absolute top-1 right-1 z-10 opacity-0 group-hover/inline-edit:opacity-100 transition-opacity pointer-events-auto bg-zinc-900/80 rounded-full p-1 shadow-lg border border-blue-400/60">
        <svg
          className="w-4 h-4 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z"
          />
        </svg>
      </span>
      <span className="absolute left-0 right-0 top-0 bottom-0 border border-blue-400/40 rounded pointer-events-none group-hover/inline-edit:border-blue-400/80 transition-all" />
    </span>
  );
};

const InlineTagEditor = ({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [temp, setTemp] = useState("");
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span key={tag + idx} className="relative group">
          {editingIdx === idx ? (
            <input
              className="px-2 py-1 rounded-full border-2 border-blue-400/80 bg-zinc-900/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 min-w-[60px] text-sm"
              value={temp}
              autoFocus
              onChange={(e) => setTemp(e.target.value)}
              onBlur={() => {
                const newTags = [...tags];
                newTags[idx] = temp.trim() || tag;
                setEditingIdx(null);
                setTemp("");
                onChange(newTags);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newTags = [...tags];
                  newTags[idx] = temp.trim() || tag;
                  setEditingIdx(null);
                  setTemp("");
                  onChange(newTags);
                } else if (e.key === "Escape") {
                  setEditingIdx(null);
                  setTemp("");
                }
              }}
            />
          ) : (
            <span
              className="px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300 text-sm cursor-pointer hover:border-blue-400"
              tabIndex={0}
              onClick={() => {
                setEditingIdx(idx);
                setTemp(tag);
              }}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setEditingIdx(idx)
              }
              role="button"
              aria-label={`Edit specialty ${tag}`}
            >
              {tag}
            </span>
          )}
          <button
            className="absolute -top-2 -right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              const newTags = [...tags];
              newTags.splice(idx, 1);
              onChange(newTags);
            }}
            tabIndex={-1}
            aria-label="Remove specialty"
            type="button"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}
      <button
        className="px-2 py-1 rounded-full border border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 text-xs"
        onClick={() => onChange([...tags, "New Specialty"])}
        type="button"
      >
        + Add Specialty
      </button>
    </div>
  );
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
  onEdit,
}: TeamBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const headingId = useId();

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleMemberField = (idx: number, field: string, value: any) => {
    if (!onEdit) return;
    const newMembers = [...teamMembers];
    newMembers[idx] = { ...newMembers[idx], [field]: value };
    onEdit("teamMembers", newMembers);
  };
  const handleSpecialties = (idx: number, newTags: string[]) => {
    if (!onEdit) return;
    const newMembers = [...teamMembers];
    newMembers[idx] = { ...newMembers[idx], specialties: newTags };
    onEdit("teamMembers", newMembers);
  };
  const handleAddMember = () => {
    if (!onEdit) return;
    const newMembers = [
      ...teamMembers,
      {
        _key: Math.random().toString(36).slice(2, 10),
        name: "New Member",
        credentials: "",
        role: "Role",
        roleDescription: "",
        email: "",
        specialties: [],
      },
    ];
    onEdit("teamMembers", newMembers);
  };
  const handleRemoveMember = (idx: number) => {
    if (!onEdit) return;
    const newMembers = [...teamMembers];
    newMembers.splice(idx, 1);
    onEdit("teamMembers", newMembers);
  };

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
            <InlineEdit
              value={subheading}
              onChange={(val) => handleField("subheading", val)}
              fieldName="subheading"
              as="span"
              className="inline-block"
              inputClassName="text-base font-semibold leading-7 text-gray-400 uppercase tracking-wider"
            />
          </motion.p>
          <motion.h2
            id={headingId}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300"
          >
            <InlineEdit
              value={heading}
              onChange={(val) => handleField("heading", val)}
              fieldName="heading"
              as="span"
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-300"
              inputClassName="text-4xl font-bold tracking-tight bg-transparent text-white"
            />
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-gray-400"
            >
              <InlineEdit
                value={description}
                onChange={(val) => handleField("description", val)}
                fieldName="description"
                as="span"
                className="inline-block"
                inputClassName="text-lg leading-8 bg-transparent text-gray-400"
                multiline
              />
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
              <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm transition-all duration-300 p-8">
                <button
                  className="absolute top-2 right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => handleRemoveMember(index)}
                  tabIndex={-1}
                  aria-label="Remove member"
                  type="button"
                  style={{ fontSize: 0 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="aspect-square overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 ring-1 ring-gray-700 flex items-center justify-center">
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
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <InlineEdit
                      value={member.name}
                      onChange={(val) => handleMemberField(index, "name", val)}
                      fieldName="name"
                      as="h3"
                      className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300"
                      inputClassName="text-2xl font-semibold bg-transparent text-white"
                    />
                    <InlineEdit
                      value={member.role}
                      onChange={(val) => handleMemberField(index, "role", val)}
                      fieldName="role"
                      as="p"
                      className="text-lg font-medium text-gray-400"
                      inputClassName="text-lg font-medium text-gray-400 bg-transparent"
                    />
                    <InlineEdit
                      value={member.credentials || ""}
                      onChange={(val) =>
                        handleMemberField(index, "credentials", val)
                      }
                      fieldName="credentials"
                      as="p"
                      className="text-sm font-medium text-gray-300"
                      inputClassName="text-sm font-medium text-gray-300 bg-transparent"
                    />
                  </div>
                  <InlineEdit
                    value={member.roleDescription || ""}
                    onChange={(val) =>
                      handleMemberField(index, "roleDescription", val)
                    }
                    fieldName="roleDescription"
                    as="p"
                    className="text-base text-gray-400 leading-relaxed"
                    inputClassName="text-base text-gray-400 bg-transparent"
                    multiline
                  />
                  <InlineTagEditor
                    tags={member.specialties || []}
                    onChange={(tags) => handleSpecialties(index, tags)}
                  />
                  <InlineEdit
                    value={member.email}
                    onChange={(val) => handleMemberField(index, "email", val)}
                    fieldName="email"
                    as="a"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-all duration-200"
                    inputClassName="text-sm text-gray-400 bg-transparent"
                  >
                    <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>{member.email}</span>
                  </InlineEdit>
                </div>
              </div>
            </motion.div>
          ))}
          <button
            className="mt-8 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 w-full"
            onClick={handleAddMember}
            type="button"
          >
            <svg
              className="w-4 h-4 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Team Member
          </button>
        </div>
      </div>
    </section>
  );
}
