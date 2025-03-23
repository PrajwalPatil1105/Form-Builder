import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="container mx-auto px-4 py-0">
      <header className="w-full p-3">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <img
              src="./Images/Logo.png"
              alt="PepperCloud Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-semibold text-slate-800">
              PepperCloud
            </span>
          </div>
        </motion.div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 mt-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-relaxed">
            Empowering Businesses with{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              PepperCloud
            </span>
          </h1>

          <p className="text-sm md:text-s text-slate-600 max-w-2xl mx-auto">
            Grow your sales with the best CRM system designed for small and
            medium businesses. Connect WhatsApp, Facebook Messenger and
            Instagram, and more to harness the power of artificial intelligence
            to close deals faster!
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10"
          >
            <a
              href="/home"
              className="inline-block px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium rounded-full shadow-lg shadow-orange-200 hover:shadow-xl transition-all duration-300 text-lg"
            >
              View Assignment
            </a>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-slate-700">AI-powered sales automation</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-slate-700">Social media integrations</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-slate-700">Smart business analytics</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
