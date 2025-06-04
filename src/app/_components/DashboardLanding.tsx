"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { NavbarContent } from "@/src/components/navbar-content";
import { FooterContent } from "@/src/components/footer-content";
import { useRouter } from "next/navigation";
import React from "react";

export function DashboardLanding() {
  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <NavbarContent />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl w-full text-center bg-zinc-900/90 rounded-2xl shadow-2xl p-10 border border-zinc-800/80 backdrop-blur-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
          >
            Welcome to Your Page Builder Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-lg text-zinc-300 mb-8"
          >
            Effortlessly create, edit, and manage beautiful pages for your
            website. Get started by creating your first page.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition-all duration-200 border border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            >
              <Plus className="w-5 h-5" />
              Create
            </button>
          </motion.div>
          {showModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <div
                className="relative w-full max-w-md mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 text-zinc-400 hover:text-white text-2xl"
                  onClick={() => setShowModal(false)}
                  title="Close"
                >
                  ×
                </button>
                <h3 className="text-xl font-bold text-white mb-6">
                  What would you like to create?
                </h3>
                <div className="flex flex-col gap-4 w-full">
                  <button
                    type="button"
                    className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 border border-blue-500/40"
                    onClick={() => {
                      setShowModal(false);
                      router.push("/create");
                    }}
                  >
                    Create Page
                  </button>
                  <button
                    type="button"
                    className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 border border-purple-500/40"
                    onClick={() => {
                      setShowModal(false);
                      router.push("/blog-builder");
                    }}
                  >
                    Create Blog
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <FooterContent />
    </div>
  );
}
