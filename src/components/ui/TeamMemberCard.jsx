import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';

const TeamMemberCard = ({ member, index }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
            {member.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2 rounded-full text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-bold text-lg text-aws-dark">{member.name}</h3>
        <p className="text-aws-orange text-sm font-medium mt-1">{member.role}</p>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
