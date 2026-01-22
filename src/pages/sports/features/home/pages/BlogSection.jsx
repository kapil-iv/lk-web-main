import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  Sparkles
} from "lucide-react";

const BlogsSection = () => {
  const swiperRef = useRef(null);
  
  // Blogs Data
  const blogs = [
    {
      id: 1,
      title: "The Ultimate Guide to Home Workouts",
      description: "Discover effective workout routines you can do at home with minimal equipment.",
      date: "Mar 15, 2024",
      author: "Sarah Johnson",
      readTime: "5 min read",
      category: "Fitness",
      likes: 245,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop",
      tags: ["Workout", "Home", "Beginners"],
    },
    {
      id: 2,
      title: "Nutrition Tips for Athletes",
      description: "Optimize your performance with these essential nutrition strategies.",
      date: "Mar 10, 2024",
      author: "Mike Chen",
      readTime: "7 min read",
      category: "Nutrition",
      likes: 189,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
      tags: ["Nutrition", "Athletes", "Health"],
    },
    {
      id: 3,
      title: "Mindfulness & Meditation for Better Performance",
      description: "Learn how meditation can improve your focus and athletic performance.",
      date: "Mar 5, 2024",
      author: "Lisa Wang",
      readTime: "6 min read",
      category: "Mental Health",
      likes: 312,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop",
      tags: ["Meditation", "Focus", "Wellness"],
    },
    {
      id: 4,
      title: "Building Strength: A 30-Day Challenge",
      description: "Join our 30-day strength building challenge with daily workouts.",
      date: "Feb 28, 2024",
      author: "David Lee",
      readTime: "8 min read",
      category: "Strength Training",
      likes: 421,
      image: "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=500&auto=format&fit=crop",
      tags: ["Challenge", "Strength", "Workout"],
    },
    {
      id: 5,
      title: "Recovery Techniques for Optimal Results",
      description: "Essential recovery methods to maximize your training benefits.",
      date: "Feb 22, 2024",
      author: "Emma Davis",
      readTime: "4 min read",
      category: "Recovery",
      likes: 178,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop",
      tags: ["Recovery", "Rest", "Techniques"],
    },
    {
      id: 6,
      title: "Yoga for Sports Performance",
      description: "How yoga can enhance flexibility and prevent injuries.",
      date: "Feb 18, 2024",
      author: "Alex Turner",
      readTime: "9 min read",
      category: "Yoga",
      likes: 267,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop",
      tags: ["Yoga", "Flexibility", "Injury Prevention"],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <BookOpen className="text-primary" size={20} />
            <span className="text-primary font-semibold">Latest Articles</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Blogs to Keep You <span className="text-primary">Fit!</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover expert tips, workout guides, and nutrition advice to help you 
            achieve your fitness goals and maintain a healthy lifestyle.
          </p>
        </motion.div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                  
                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <Heart className="text-gray-600 hover:text-red-500" size={18} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {blog.author}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Heart className="text-red-400" size={16} />
                      <span className="text-gray-600 font-medium">{blog.likes} likes</span>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-primary font-semibold group/read"
                    >
                      Read More
                      <ArrowRight className="group-hover/read:translate-x-1 transition-transform" size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile & Tablet Carousel */}
        <div className="lg:hidden">
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.1}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2.1,
                },
              }}
              autoplay={{ delay: 3000 }}
              pagination={{ 
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active bg-primary'
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="pb-12"
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-primary text-white rounded-full text-xs font-medium">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {blog.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {blog.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {blog.readTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Heart className="text-red-400" size={12} />
                          {blog.likes}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <User size={12} />
                          <span className="text-xs">{blog.author}</span>
                        </div>
                        <button className="flex items-center gap-1 text-primary text-sm font-medium">
                          Read
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors border border-gray-200"
              >
                <ChevronLeft className="text-gray-700" size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors border border-gray-200"
              >
                <ChevronRight className="text-gray-700" size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="text-yellow-300" size={24} />
                <Sparkles className="text-yellow-300" size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Stay Updated With Fitness Tips!
              </h3>
              <p className="text-gray-200  mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and get weekly fitness tips, workout plans, 
                and exclusive content delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Add your email"
                  className="flex-1 px-6 py-3 rounded-full border-2 border-white/30 bg-white/10 text-white placeholder-white focus:outline-none focus:border-white focus:bg-white/20 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Subscribe Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogsSection;