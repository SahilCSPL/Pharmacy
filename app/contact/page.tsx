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
            <h2 className="text-4xl font-semibold mb-4">Get in Touch</h2>
            <div className="mb-6">
              <h3 className="font-semibold text-2xl mb-2 text-[--mainColor]">
                <i className="text-xl fa-solid fa-location-dot mr-3"></i>{" "}
                Address
              </h3>
              <p className="text-lg">
                Sacred World, Office #: 707,
                <br /> South Block, Wanwadi, Pune,
                <br /> Maharashtra
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-2xl mb-2 text-[--mainColor]">
                <i className="fa-solid fa-envelope mr-3"></i> Email
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
              <h3 className="font-semibold text-2xl mb-2 text-[--mainColor]">
                <i className="fa-solid fa-phone-volume mr-3"></i> Phone
              </h3>
              <p className="text-lg">
                <a
                  href="tel:+919004991455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--textColor] hover:text-[--mainColor] transition duration-300"
                >
                  +919004991455
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Location */}
          <div className="lg:w-1/2 border rounded-lg p-4">
            <h2 className="text-4xl font-semibold mb-4">Our Location</h2>
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
