import TestimonialsSlider from "@/components/ClientSideComponent/HomePageComponents/TestimonialSection/testimonialsSlider"

// Example testimonial data
const testimonials = [
  {
    id: 1,
    image: "/testimonial/testimonial-slide-1.webp",
    comment:
      "This product completely transformed my daily routine—its efficiency and sleek design have exceeded my expectations. I can't imagine my day without it!",
    name: "Kelly Home",
  },
  {
    id: 2,
    image: "/testimonial/testimonial-slide-2.webp",
    comment:
      "The quality and service were outstanding. Every interaction was seamless, and the product's performance truly stands out in a crowded market.",
    name: "Jacob Smith",
  },
  {
    id: 3,
    image: "/testimonial/testimonial-slide-3.webp",
    comment:
      "I'm amazed at how this product elevated my experience. It combines innovative technology with user-friendly features, making every day more enjoyable.",
    name: "Andrew Neel",
  },
  {
    id: 4,
    image: "/testimonial/testimonial-slide-4.webp",
    comment:
      "From the moment I started using it, I noticed a remarkable difference. The exceptional craftsmanship and attention to detail make it a standout product in its category.",
    name: "Lucas Gallone",
  },
]

export default function TestimonialSection() {
  return (
    <section
      className="bg-cover bg-center py-4 lg:py-5"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background/testimonial-bg.webp)",
      }}
    >
      <div className="container mx-auto px-4 testimonial">
        <h2 className="text-[20px] lg:text-[40px] text-white font-bold text-center">Testimonials</h2>

        <TestimonialsSlider testimonials={testimonials} />
      </div>
    </section>
  )
}

