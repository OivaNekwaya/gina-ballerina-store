"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate sending (replace with actual API call later)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
    // Uncomment when backend is ready:
    /*
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    */
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-dancing font-bold text-center bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent mb-6">
          Contact Us
        </h1>
        <div className="flex justify-center gap-1.5 mb-8">
          <span className="block w-2 h-2 rounded-full bg-pink"></span>
          <span className="block w-2 h-2 rounded-full bg-purple"></span>
          <span className="block w-2 h-2 rounded-full bg-gray-300"></span>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-pink/20">
          <p className="text-gray-600 text-center mb-6">
            Have a question, a dance story, or just want to say hello?<br />
            We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink focus:border-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink focus:border-pink"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-pink hover:bg-purple text-white font-semibold py-2.5 rounded-lg transition shadow-md disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "success" && (
              <p className="text-green-600 text-sm text-center">Thank you! We'll get back to you soon. 💖</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again later.</p>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-pink/20 text-center text-sm text-gray-500">
            <p>📧 Alternatively, email us directly:</p>
            <p className="text-pink font-medium">hello@ginaballerina.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}