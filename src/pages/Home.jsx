import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Users, Award, BookOpen, Star } from 'lucide-react';
import Button from '../components/ui/Button';

const benefits = [
  { icon: <Terminal className="w-8 h-8" />, title: "AWS Skills", desc: "Learn cloud computing concepts and get hands-on experience with AWS services." },
  { icon: <Users className="w-8 h-8" />, title: "Networking", desc: "Connect with like-minded students, industry professionals, and AWS experts." },
  { icon: <Award className="w-8 h-8" />, title: "Hackathons", desc: "Participate in cloud hackathons and build real-world solutions." },
  { icon: <BookOpen className="w-8 h-8" />, title: "Mentorship", desc: "Get guidance from seniors and professionals in your cloud journey." },
];

const testimonials = [
  { name: "Rahul S.", role: "Cloud Enthusiast", text: "Joining SBG SKIT was the best decision of my college life. I learned so much about AWS and landed a great internship!", rating: 5 },
  { name: "Priya M.", role: "Web Developer", text: "The community here is incredibly supportive. The hands-on workshops gave me the confidence to build and deploy apps on AWS.", rating: 5 },
  { name: "Aman K.", role: "Tech Lead", text: "The resources and mentorship provided by the club helped me clear my AWS Certified Cloud Practitioner exam.", rating: 4 },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-aws-dark text-white pt-32 pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-aws-dark via-gray-900 to-skit-blue opacity-90 z-0"></div>
        
        {/* Animated Background shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-aws-orange rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"
        />
        <motion.div 
          animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-20 w-80 h-80 bg-skit-blue rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-aws-orange"
            >
              Build the Future with Cloud
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
              Welcome to the AWS Student Builder Group at SKIT. Explore, learn, and build with Amazon Web Services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button href="https://www.meetup.com/" target="_blank" variant="primary" className="text-lg px-8 py-4">
                Join Us Today
              </Button>
              <Button href="/events" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white/10 focus:ring-white">
                Explore Events
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-aws-dark mb-4"
            >
              Why Join AWS SBG SKIT?
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-24 h-1 bg-aws-orange mx-auto rounded-full"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group"
              >
                <div className="w-16 h-16 bg-orange-100 text-aws-orange rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-aws-dark mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-24 bg-aws-light relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <svg className="absolute left-0 top-0 h-full w-full text-gray-200 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentcolor">
             <polygon points="0,0 100,0 0,100" />
           </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-aws-dark mb-4"
            >
              Member Experiences
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-24 h-1 bg-aws-orange mx-auto rounded-full"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.3, rotate: 10 }}>
                      <Star 
                        className={`w-6 h-6 ${i < t.rating ? 'fill-aws-orange text-aws-orange' : 'text-gray-300'}`} 
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-aws-dark">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
