import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="h-48 bg-gradient-to-r from-aws-dark to-skit-blue relative overflow-hidden">
        {/* Placeholder for event image if any, otherwise showing a gradient */}
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-aws-orange uppercase tracking-wider">
          {event.status}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-aws-dark mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-aws-orange" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-aws-orange" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-aws-orange" />
            <span>{event.location}</span>
          </div>
        </div>
        
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full py-2 bg-aws-light text-aws-dark font-medium rounded-lg hover:bg-aws-orange hover:text-white transition-colors"
          >
            View Details
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
