"use client";
import React from "react";

export default function ContactUs() {
  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div
        className="bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background/contact-us-banner.jpg)",
        }}
      >
        <h1 className="text-white text-4xl font-bold">Contact Us</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Contact Details */}
          <div className="lg:w-1/2 border rounded-lg p-4">
            <h2 className="text-4xl font-medium mb-4">Get in Touch</h2>
            <div className="mb-6">
              <h3 className="font-medium text-2xl mb-2 text-[--mainColor] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mr-2"
                >
                  <path d="M12 11c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2z" />
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
                </svg>{" "}
                Address
              </h3>

              <p className="text-lg">
                Sacred World, Office #: 707,
                <br /> South Block, Wanwadi, Pune,
                <br /> Maharashtra
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-2xl mb-2 text-[--mainColor] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mr-2"
                >
                  <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>{" "}
                Email
              </h3>

              <p className="text-lg">
                <a
                  href="mailto:sales@consociatesolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--textColor] hover:text-[--mainColor] transition duration-300"
                >
                  sales@consociatesolutions.com
                </a>
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-2xl mb-2 text-[--mainColor] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mr-2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72c.1.54.29 1.94.48 2.4a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.46.19.86.38 2.4.48A2 2 0 0 1 22 16.92z" />
                </svg>{" "}
                Phone
              </h3>

              <p className="text-lg">
                <a
                  href="tel:+919004991455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--textColor] hover:text-[--mainColor] transition duration-300"
                >
                  +91 90049 91455
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Location */}
          <div className="lg:w-1/2 border rounded-lg p-4">
            <h2 className="text-4xl font-medium mb-4">Our Location</h2>
            <div className="w-full h-[300px]">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.297508436355!2d73.89797340933293!3d18.490755882524454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1d766a5f3d5%3A0xa649d083cdb0fb19!2sSacred%20World!5e1!3m2!1sen!2sin!4v1740488168523!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                className="rounded-md shadow-md"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
