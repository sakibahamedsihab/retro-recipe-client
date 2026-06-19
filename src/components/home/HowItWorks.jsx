"use client";

import { motion } from "framer-motion";
import { FaUtensils, FaCamera, FaShareAlt } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: <FaUtensils className="text-4xl text-black" />,
      title: "Cook a Dish",
      description:
        "Prepare your favorite recipe in your kitchen. Make it delicious and unique.",
    },
    {
      id: 2,
      icon: <FaCamera className="text-4xl text-black" />,
      title: "Snap a Picture",
      description:
        "Capture the beauty of your culinary masterpiece with a nice, clear photo.",
    },
    {
      id: 3,
      icon: <FaShareAlt className="text-4xl text-black" />,
      title: "Share with Us",
      description:
        "Upload the details and share it with our vibrant community of food lovers.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-16 md:my-24"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black inline-block border-b-4 border-black pb-2">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            className="bg-[#FDFBF7] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="bg-[#FFC900] w-20 h-20 mx-auto border-4 border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {step.icon}
            </div>
            <h3 className="text-xl font-black uppercase mb-3 text-black">
              {step.id}. {step.title}
            </h3>
            <p className="font-medium text-black">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
