import React from 'react';
import { motion } from 'framer-motion';
import EventCard from '../components/ui/EventCard';
import Button from '../components/ui/Button';

// Placeholder JSON data
const upcomingEvents = [
  { id: 1, title: "AWS DeepRacer League", date: "Oct 15, 2026", time: "10:00 AM", location: "SKIT Campus, Room 401", description: "Learn reinforcement learning by racing autonomous 1/18th scale cars.", status: "Upcoming" },
  { id: 2, title: "Cloud Security Workshop", date: "Oct 22, 2026", time: "2:00 PM", location: "Virtual (Zoom)", description: "Hands-on workshop on securing your AWS infrastructure using IAM and GuardDuty.", status: "Upcoming" },
];

const ongoingEvents = [
  { id: 3, title: "100 Days of Cloud", date: "Sep 1 - Dec 10, 2026", time: "Flexible", location: "Online Discord", description: "A community challenge to learn cloud computing every day for 100 days.", status: "Ongoing" },
];

const pastEvents = [
  { id: 4, title: "AWS Cloud Practitioner Bootcamp", date: "Aug 10, 2026", time: "9:00 AM", location: "Main Auditorium", description: "A comprehensive bootcamp to kickstart your AWS certification journey.", status: "Past" },
  { id: 5, title: "Serverless Web Apps with React", date: "Jul 25, 2026", time: "11:00 AM", location: "Lab 2", description: "Built and deployed a full-stack serverless application using AWS Amplify.", status: "Past" },
];

const Events = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      
      {/* Header & CTA */}
      <section className="bg-aws-dark text-white py-20 mt-[-6rem] pt-32 mb-16 rounded-b-[3rem] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Events & Workshops
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Join us for hands-on workshops, expert talks, and hackathons to accelerate your cloud journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Button href="https://www.meetup.com/" target="_blank" variant="primary" className="text-lg px-8 py-4 shadow-xl shadow-orange-500/20">
              Follow us on Meetup
            </Button>
            <p className="mt-4 text-sm text-gray-400">Never miss an update on our latest events!</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Ongoing Events */}
        {ongoingEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-aws-dark">Ongoing Events</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-aws-dark">Upcoming Events</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-aws-dark">Past Events</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Schedule / Timeline Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aws-dark mb-4">Yearly Schedule</h2>
            <p className="text-gray-500">A sneak peek into what we have planned for the next 12 months.</p>
          </div>
          
          <div className="relative border-l-4 border-aws-orange/30 ml-3 md:ml-6 space-y-12 pb-8">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute -left-[14px] top-2 w-6 h-6 rounded-full bg-white border-4 border-aws-orange shadow-md"></div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Month {i + 1}</h3>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <p className="text-sm text-gray-400 mt-4 italic">More details to be announced soon...</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Events;
