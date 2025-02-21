"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi";

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Newsletter
      </h4>
      <p className="text-[--textColor] mb-[10px]">
        Subscribe for the latest updates.
      </p>
      <form onSubmit={handleSubscribe} className="flex">
        <input
          type="email"
          placeholder="Email*"
          className="p-3 text-black border border-[#e4ecf2] focus:outline-[#80b500] outline-1 transition duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-[#80b500] p-3 border border-[#80b500] text-white flex items-center justify-center">
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
