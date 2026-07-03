import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from '../components/ui/TeamMemberCard';
import { Target, Lightbulb, Rocket } from 'lucide-react';

const leads = [
  { name: "Aditi S.", role: "President", linkedin: "https://linkedin.com", image: null },
  { name: "Karan V.", role: "Vice President", linkedin: "https://linkedin.com", image: null },
  { name: "Sneha R.", role: "Tech Lead", linkedin: "https://linkedin.com", image: null },
];

const subTeams = [
  {
    name: "Development Team",
    members: [
      { name: "Raj", role: "Frontend Dev", linkedin: "https://linkedin.com" },
      { name: "Riya", role: "Backend Dev", linkedin: "https://linkedin.com" },
    ]
  },
  {
    name: "Design Team",
    members: [
      { name: "Amit", role: "UI/UX Designer", linkedin: "https://linkedin.com" },
      { name: "Pooja", role: "Graphic Designer", linkedin: "https://linkedin.com" },
    ]
  },
  {
    name: "Tutor Team",
    members: [
      { name: "Neha", role: "AWS Tutor", linkedin: "https://linkedin.com" },
      { name: "Vikram", role: "Cloud Tutor", linkedin: "https://linkedin.com" },
    ]
  },
  {
    name: "Management Team",
    members: [
      { name: "Simran", role: "Event Manager", linkedin: "https://linkedin.com" },
      { name: "Rahul", role: "Operations Head", linkedin: "https://linkedin.com" },
    ]
  },
  {
    name: "Content Team",
    members: [
      { name: "Ananya", role: "Content Writer", linkedin: "https://linkedin.com" },
    ]
  },
  {
    name: "Editing Team",
    members: [
      { name: "Kunal", role: "Video Editor", linkedin: "https://linkedin.com" },
    ]
  }
];

const About = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Mission Section */}
      <section className="mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-aws-dark mb-6"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              To foster a community of passionate cloud enthusiasts, bridging the gap between academic learning and industry standards through Amazon Web Services.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <Target />, title: "Learn", desc: "Equip students with cutting-edge AWS skills through workshops and seminars." },
              { icon: <Lightbulb />, title: "Innovate", desc: "Encourage out-of-the-box thinking by building real-world cloud solutions." },
              { icon: <Rocket />, title: "Grow", desc: "Provide mentorship and networking opportunities to kickstart careers." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-50 text-skit-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  {React.cloneElement(item.icon, { className: 'w-8 h-8' })}
                </div>
                <h3 className="text-xl font-bold text-aws-dark mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Leads */}
      <section className="bg-aws-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aws-dark mb-4">Meet the Leadership</h2>
            <div className="w-20 h-1 bg-aws-orange mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {leads.map((lead, index) => (
              <TeamMemberCard key={index} member={lead} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Sub Teams */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-aws-dark mb-4">Our Teams</h2>
            <p className="text-gray-600">The driving force behind AWS SBG SKIT</p>
          </div>

          <div className="space-y-16">
            {subTeams.map((team, teamIndex) => (
              <motion.div 
                key={teamIndex}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3 className="text-2xl font-bold text-skit-blue mb-8 border-b pb-2">{team.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {team.members.map((member, idx) => (
                    <TeamMemberCard key={idx} member={member} index={idx} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
