import Image from "next/image";
import React from "react";
import { Testimonial } from "./TestimonialSection";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="p-6 rounded-lg shadow-md flex flex-col items-center bg-white/30 backdrop-blur-md">
      <div className="border-[7px] border-white w-[100px] h-[100px] rounded-[50%] mb-5">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={100}
          height={100}
          className="rounded-full mb-4 object-cover border-5 border-white"
        />
      </div>
      <p className="text-white italic mb-4 text-center px-4">
        "{testimonial.comment}"
      </p>
      <h4 className="text-white text-lg font-semibold">
        - {testimonial.name}
      </h4>
    </div>
  );
};

export default TestimonialCard;
