import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, CloudLightning } from 'lucide-react';
import { FaGithub, FaYoutube } from 'react-icons/fa';

const resources = [
  {
    category: "Getting Started",
    icon: <CloudLightning className="w-6 h-6 text-aws-orange" />,
    items: [
      { title: "AWS Cloud Practitioner Essentials", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", type: "Course" },
      { title: "AWS Educate", url: "https://aws.amazon.com/education/awseducate/", type: "Platform" },
      { title: "AWS Getting Started Resource Center", url: "https://aws.amazon.com/getting-started/", type: "Documentation" }
    ]
  },
  {
    category: "Tutorials & Labs",
    icon: <BookOpen className="w-6 h-6 text-aws-orange" />,
    items: [
      { title: "AWS Workshops", url: "https://workshops.aws/", type: "Hands-on" },
      { title: "Qwiklabs for AWS", url: "https://www.qwiklabs.com/", type: "Hands-on" },
      { title: "Serverless Land", url: "https://serverlessland.com/", type: "Tutorials" }
    ]
  },
  {
    category: "Community & Repositories",
    icon: <FaGithub className="w-6 h-6 text-aws-orange" />,
    items: [
      { title: "AWS Samples GitHub", url: "https://github.com/aws-samples", type: "Code" },
      { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/", type: "Reference" },
      { title: "AWS Builders Library", url: "https://aws.amazon.com/builders-library/", type: "Articles" }
    ]
  },
  {
    category: "Video Content",
    icon: <FaYoutube className="w-6 h-6 text-aws-orange" />,
    items: [
      { title: "AWS Official YouTube", url: "https://www.youtube.com/user/AmazonWebServices", type: "Video" },
      { title: "FooBar Serverless", url: "https://www.youtube.com/c/FooBar_codes", type: "Video" },
      { title: "Be A Better Dev", url: "https://www.youtube.com/c/BeABetterDev", type: "Video" }
    ]
  }
];

const Resources = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-aws-dark mb-6"
          >
            Learning Resources
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Curated content, tutorials, and repositories to help you master AWS and cloud technologies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-aws-dark">{section.category}</h2>
              </div>
              
              <ul className="space-y-4">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-aws-orange hover:shadow-md transition-all"
                    >
                      <div>
                        <h3 className="font-semibold text-aws-dark group-hover:text-aws-orange transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mt-2 inline-block">
                          {item.type}
                        </span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-aws-orange transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 bg-skit-blue text-white rounded-3xl text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Have a resource to share?</h2>
          <p className="mb-6 text-gray-300 max-w-xl mx-auto">We are always looking to expand our library. If you know a great tutorial, repository, or tool, let us know!</p>
          <a href="/contact" className="inline-block bg-white text-skit-blue font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
            Suggest a Resource
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
