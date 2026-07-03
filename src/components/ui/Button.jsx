import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  href = null,
  target = "_self",
  ...props 
}) => {
  const baseStyle = "inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-white bg-aws-orange hover:bg-orange-600 focus:ring-aws-orange",
    secondary: "text-aws-dark bg-gray-100 hover:bg-gray-200 focus:ring-gray-500",
    outline: "text-aws-orange border-aws-orange bg-transparent hover:bg-orange-50 focus:ring-aws-orange",
  };

  const combinedClasses = `${baseStyle} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={combinedClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={combinedClasses}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
