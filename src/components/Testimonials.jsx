import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  // Kuicko Testimonials
  {
    quote: "I ordered snacks late at night and Kuicko delivered in under 30 minutes. Super fast and reliable!",
    name: "Rohit Sharma",
    location: "Bikaner",
    avatar: "https://i.pravatar.cc/150?u=rohit-sharma"
  },
  {
    quote: "Kuicko is my go-to app when I don’t want to cook. Great food options and smooth delivery every time.",
    name: "Neha Jain",
    location: "Jaipur",
    avatar: "https://i.pravatar.cc/150?u=neha-jain"
  },
  {
    quote: "Used Kuicko to send sweets to my family during festivals. Felt like being Santa 🎅",
    name: "Ankit Verma",
    location: "Bikaner",
    avatar: "https://i.pravatar.cc/150?u=ankit-verma"
  },
  {
    quote: "Food arrived hot, well packed, and exactly on time. Kuicko never disappoints.",
    name: "Pooja Agarwal",
    location: "Happy Customer",
    avatar: "https://i.pravatar.cc/150?u=pooja-agarwal"
  },
  {
    quote: "From breakfast to late-night cravings, Kuicko handles it all.",
    name: "Rahul Meena",
    location: "Foodie",
    avatar: "https://i.pravatar.cc/150?u=rahul-meena"
  },
  // Local Konnect Testimonials
  {
    quote: "Booked an electrician through Local Konnect and the experience was seamless. Verified professional and quick service.",
    name: "Suresh Kumar",
    location: "Bikaner",
    avatar: "https://i.pravatar.cc/150?u=suresh-kumar"
  },
  {
    quote: "Finally an app that connects us with trusted local service providers. Very helpful!",
    name: "Ritu Choudhary",
    location: "Local Resident",
    avatar: "https://i.pravatar.cc/150?u=ritu-choudhary"
  },
  {
    quote: "Booked event tickets via Local Konnect and everything was smooth. No confusion, no delays.",
    name: "Aman Singh",
    location: "Event Goer",
    avatar: "https://i.pravatar.cc/150?u=aman-singh"
  },
  {
    quote: "From plumbers to event bookings, Local Konnect saves so much time.",
    name: "Nisha Joshi",
    location: "Happy User",
    avatar: "https://i.pravatar.cc/150?u=nisha-joshi"
  },
  {
    quote: "As a service provider, Local Konnect helped me reach more customers in my city.",
    name: "Local Salon Owner",
    location: "Service Partner",
    avatar: "https://i.pravatar.cc/150?u=salon-owner"
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] bg-white rounded-2xl p-6 md:p-8 shadow-lg mx-3 md:mx-4 border border-gray-100">
    <Quote className="w-8 h-8 md:w-10 md:h-10 text-brand-secondary mb-4" />
    <p className="text-gray-700 mb-4 md:mb-6 text-base md:text-lg leading-relaxed">"{testimonial.quote}"</p>
    <div className="flex items-center">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-brand-secondary"
      />
      <div className="ml-3 md:ml-4">
        <p className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</p>
        <p className="text-xs md:text-sm text-gray-500">{testimonial.location}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const marqueeVariants = {
    animate: {
      x: [0, -2892], // (450px card + 32px margin) * 6 cards
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          What our customers say about us
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Real stories from our vibrant community of event-goers and organizers.
        </p>
      </div>
      <div className="relative">
        <motion.div
          className="flex py-4"
          variants={marqueeVariants}
          animate="animate"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default Testimonials;
