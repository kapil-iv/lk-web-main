import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Trophy, 
  Heart, 
  Star, 
  Globe, 
  Calendar,
  ArrowRight,
  Sparkles,
  Briefcase,
  BookOpen,
  Award,
  TrendingUp,
  Zap,
  Clock
} from "lucide-react";

const AboutTeamSection = () => {
  // Team stats data
  const teamStats = [
    { icon: <Users className="text-primary" size={24} />, label: "Team Members", value: "50+", suffix: "" },
    { icon: <Target className="text-primary" size={24} />, label: "Projects Completed", value: "200", suffix: "+" },
    { icon: <Trophy className="text-primary" size={24} />, label: "Awards Won", value: "15", suffix: "" },
    { icon: <Heart className="text-primary" size={24} />, label: "Happy Clients", value: "5K", suffix: "+" },
    { icon: <Globe className="text-primary" size={24} />, label: "Cities Covered", value: "25", suffix: "+" },
    { icon: <Star className="text-primary" size={24} />, label: "Rating", value: "4.9", suffix: "/5" },
  ];

  // Team values
  const teamValues = [
    {
      icon: <Zap className="text-primary" size={20} />,
      title: "Innovation",
      description: "Always pushing boundaries to deliver cutting-edge solutions"
    },
    {
      icon: <Users className="text-primary" size={20} />,
      title: "Collaboration",
      description: "Working together to achieve extraordinary results"
    },
    {
      icon: <Target className="text-primary" size={20} />,
      title: "Excellence",
      description: "Striving for perfection in everything we do"
    },
    {
      icon: <Heart className="text-primary" size={20} />,
      title: "Passion",
      description: "Love what we do, and it shows in our work"
    }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      y: -8,
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const statCardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (custom) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      y: -5,
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-primary/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Users className="text-primary" size={20} />
            <span className="text-primary font-semibold">Our Amazing Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Meet <span className="text-primary">The Team</span> Behind LK Sports
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            LK Sports gives you the blocks & components you need to create a truly professional
            sports booking platform, connecting players, venues, and trainers.
          </p>
        </motion.div>

        {/* Team Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {teamStats.map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={statCardVariants}
              whileHover="hover"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}<span className="text-primary">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Our <span className="text-primary">Core Values</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamValues.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">
                    {value.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-3 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40"
            >
              <Briefcase size={20} />
              SEE OPENINGS
              <ArrowRight size={16} />
            </motion.button>
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 shadow-lg border border-gray-200 hover:border-gray-300"
            >
              <BookOpen size={20} />
              READ OUR STORY
              <ArrowRight size={16} />
            </motion.button>
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center gap-3 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <Award size={20} className="relative z-10" />
              <span className="relative z-10">WE ARE HIRING!</span>
              <TrendingUp size={16} className="relative z-10" />
            </motion.button>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-center shadow-xl max-w-2xl"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="text-yellow-300" size={24} />
              <Clock className="text-yellow-300" size={24} />
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Growing Team!
            </h3>
            <p className="text-gray-200 mb-6">
              We're always looking for passionate individuals who want to make a difference 
              in the sports technology space. Check out our current openings and be part 
              of something amazing!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto shadow-lg"
            >
              <Calendar size={18} />
              Schedule a Call
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeamSection;