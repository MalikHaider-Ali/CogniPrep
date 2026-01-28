// app/config/interviewCategories.js
import { FaReact, FaPython, FaJava, FaNode, FaAws, FaDocker, FaDatabase } from "react-icons/fa";
import { SiTailwindcss, SiKubernetes, SiMongodb, SiPostgresql, SiFlutter, SiSwift, SiTypescript, SiRedis } from "react-icons/si";

export const INTERVIEW_CATEGORIES = {
  'Frontend Developer Interview': {
    title: 'Frontend Developer Interview',
    shortTitle: 'Frontend Dev Interview',
    type: 'Technical',
    icon: '⚛️',
    color: 'bg-purple-600',
    description: 'Master modern UI development with React, Vue, and Angular. Tackle component architecture, state management, responsive design, and performance optimization challenges.',
    techs: [
      { icon: FaReact, color: '#61DAFB', name: 'React' },
      { icon: SiTailwindcss, color: '#38B2AC', name: 'Tailwind' }
    ]
  },
  'Backend Developer Interview': {
    title: 'Backend Developer Interview',
    shortTitle: 'Backend Dev Interview',
    type: 'Technical',
    icon: '⚙️',
    color: 'bg-red-600',
    description: 'Build robust server-side solutions with Node.js, Python, and Java. Cover RESTful APIs, database design, authentication, caching strategies, and scalable architecture.',
    techs: [
      { icon: FaNode, color: '#339933', name: 'Node.js' },
      { icon: FaPython, color: '#3776AB', name: 'Python' }
    ]
  },
  'Full-Stack Developer Interview': {
    title: 'Full-Stack Developer Interview',
    shortTitle: 'Full-Stack Dev Interview',
    type: 'Technical',
    icon: '💻',
    color: 'bg-indigo-600',
    description: 'Demonstrate end-to-end expertise across the entire stack. Navigate frontend frameworks, backend services, database optimization, and deployment strategies with confidence.',
    techs: [
      { icon: FaReact, color: '#61DAFB', name: 'React' },
      { icon: FaNode, color: '#339933', name: 'Node.js' }
    ]
  },
  'DevOps & Cloud Interview': {
    title: 'DevOps & Cloud Interview',
    shortTitle: 'DevOps & Cloud Interview',
    type: 'Technical',
    icon: '☁️',
    color: 'bg-orange-600',
    description: 'Showcase your infrastructure expertise with AWS, Azure, and GCP. Master containerization, CI/CD pipelines, infrastructure as code, monitoring, and orchestration.',
    techs: [
      { icon: FaAws, color: '#FF9900', name: 'AWS' },
      { icon: SiKubernetes, color: '#326CE5', name: 'Kubernetes' }
    ]
  },
  'Mobile App Developer Interview': {
    title: 'Mobile App Developer Interview',
    shortTitle: 'Mobile App Dev Interview',
    type: 'Technical',
    icon: '📱',
    color: 'bg-pink-600',
    description: 'Create seamless mobile experiences with React Native, Flutter, Swift, and Kotlin. Address platform-specific challenges, performance optimization, and native integrations.',
    techs: [
      { icon: SiFlutter, color: '#02569B', name: 'Flutter' },
      { icon: SiSwift, color: '#FA7343', name: 'Swift' }
    ]
  },
  'System Design Interview': {
    title: 'System Design Interview',
    shortTitle: 'System Design Interview',
    type: 'Technical',
    icon: '🏗️',
    color: 'bg-blue-600',
    description: 'Architect scalable, distributed systems from the ground up. Design for high availability, data consistency, load balancing, caching layers, and fault tolerance.',
    techs: [
      { icon: SiMongodb, color: '#47A248', name: 'MongoDB' },
      { icon: SiRedis, color: '#DC382D', name: 'Redis' }
    ]
  },
  'Database & SQL Interview': {
    title: 'Database & SQL Interview',
    shortTitle: 'Database & SQL Interview',
    type: 'Technical',
    icon: '🗄️',
    color: 'bg-teal-600',
    description: 'Optimize data storage and retrieval with SQL and NoSQL databases. Master query optimization, indexing strategies, normalization, transactions, and data modeling.',
    techs: [
      { icon: SiPostgresql, color: '#4169E1', name: 'PostgreSQL' },
      { icon: SiMongodb, color: '#47A248', name: 'MongoDB' }
    ]
  },
  'Data Science & ML Interview': {
    title: 'Data Science & ML Interview',
    shortTitle: 'Data Science & ML Interview',
    type: 'Technical',
    icon: '🤖',
    color: 'bg-green-600',
    description: 'Apply machine learning algorithms and statistical analysis to real-world problems. Cover model selection, feature engineering, evaluation metrics, and deployment.',
    techs: [
      { icon: FaPython, color: '#3776AB', name: 'Python' },
      { icon: SiTypescript, color: '#3178C6', name: 'TypeScript' }
    ]
  },
  'Cybersecurity Interview': {
    title: 'Cybersecurity Interview',
    shortTitle: 'Cybersecurity Interview',
    type: 'Technical',
    icon: '🔒',
    color: 'bg-blue-400',
    description: 'Protect systems and data from emerging threats. Demonstrate knowledge of penetration testing, encryption, network security, compliance, and incident response.',
    techs: [
      { icon: FaPython, color: '#3776AB', name: 'Python' },
      { icon: FaDocker, color: '#2496ED', name: 'Docker' }
    ]
  },
  'Behavioral Interview': {
    title: 'Behavioral Interview',
    shortTitle: 'Behavioral Interview',
    type: 'Non-Technical',
    icon: '💼',
    color: 'bg-blue-500',
    description: 'Articulate your professional experiences using the STAR method. Showcase leadership, conflict resolution, teamwork, adaptability, and decision-making skills.',
    techs: []
  },
  'HR Screening Interview': {
    title: 'HR Screening Interview',
    shortTitle: 'HR Screening Interview',
    type: 'Non-Technical',
    icon: '👥',
    color: 'bg-purple-500',
    description: 'Make a strong first impression with recruiters. Discuss career motivations, salary expectations, cultural fit, work preferences, and long-term career aspirations.',
    techs: []
  },
  'Product Manager Interview': {
    title: 'Product Manager Interview',
    shortTitle: 'Product Manager Interview',
    type: 'Non-Technical',
    icon: '📊',
    color: 'bg-yellow-600',
    description: 'Define winning product strategies and roadmaps. Balance user needs, business goals, and technical constraints while driving cross-functional team success.',
    techs: []
  },
  'Business Analyst Interview': {
    title: 'Business Analyst Interview',
    shortTitle: 'Business Analyst Interview',
    type: 'Non-Technical',
    icon: '📈',
    color: 'bg-green-500',
    description: 'Bridge business and technology with data-driven insights. Excel at requirements gathering, stakeholder management, process improvement, and solution design.',
    techs: []
  },
  'Sales & Marketing Interview': {
    title: 'Sales & Marketing Interview',
    shortTitle: 'Sales & Marketing Interview',
    type: 'Non-Technical',
    icon: '💰',
    color: 'bg-pink-500',
    description: 'Drive revenue growth and market penetration. Demonstrate persuasion skills, customer relationship management, strategic planning, and campaign execution expertise.',
    techs: []
  },
  'UI/UX Designer Interview': {
    title: 'UI/UX Designer Interview',
    shortTitle: 'UI/UX Designer Interview',
    type: 'Non-Technical',
    icon: '🎨',
    color: 'bg-red-400',
    description: 'Create intuitive, beautiful user experiences. Showcase design thinking, user research, prototyping, usability testing, and collaboration with development teams.',
    techs: []
  }
};

// Helper function to get category data by title
export const getCategoryByTitle = (title) => {
  return INTERVIEW_CATEGORIES[title] || null;
};

// Helper function to get all categories as array
export const getAllCategories = () => {
  return Object.values(INTERVIEW_CATEGORIES);
};

// Helper function to get tech icons for a category
export const getTechIcons = (categoryTitle) => {
  const category = getCategoryByTitle(categoryTitle);
  return category?.techs || [];
};