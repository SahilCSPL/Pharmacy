import { Testimonial } from "@/components/ClientSideComponent/HomePageComponents/TestimonialSection/testimonialsSlider"
import Image from "next/image"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="min-h-[300px] p-6 rounded-lg shadow-md flex flex-col items-center bg-white/30 backdrop-blur-md">
      <div className="border-[7px] border-white w-[100px] h-[100px] rounded-full mb-5 relative overflow-hidden">
        <Image src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} fill className="object-cover" />
      </div>
      <p className="text-white italic mb-4 text-center px-4 flex-grow">"{testimonial.comment}"</p>
      <h4 className="text-white text-lg font-semibold">- {testimonial.name}</h4>
    </div>
  )
}

