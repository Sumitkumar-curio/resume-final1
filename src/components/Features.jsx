import { motion } from 'framer-motion';
import {
  DocumentCheckIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Smart Resume Analysis',
    description: 'Our AI analyzes your resume against job descriptions to identify key matches and gaps.',
    icon: DocumentCheckIcon,
  },
  {
    name: 'ATS Optimization',
    description: 'Get insights on how to improve your resume for Applicant Tracking Systems.',
    icon: ChartBarIcon,
  },
  {
    name: 'AI-Powered Suggestions',
    description: 'Receive personalized suggestions to enhance your resume\'s impact.',
    icon: SparklesIcon,
  },
  {
    name: 'Instant Results',
    description: 'Get detailed analysis and recommendations in under a minute.',
    icon: ClockIcon,
  },
  {
    name: 'Privacy First',
    description: 'Your data is encrypted and never shared with third parties.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Success Tracking',
    description: 'Track your resume\'s improvement over time with detailed metrics.',
    icon: ArrowTrendingUpIcon,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Everything you need to optimize your resume
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Our AI-powered platform provides comprehensive analysis and actionable insights
            to help you land your dream job.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-white">
                  <feature.icon
                    className="h-6 w-6 flex-none text-primary-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:mt-32 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-y-3 rounded-2xl bg-dark-800 p-8"
          >
            <dt className="text-sm font-semibold leading-6 text-gray-300">Active Users</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white">10K+</dd>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-y-3 rounded-2xl bg-dark-800 p-8"
          >
            <dt className="text-sm font-semibold leading-6 text-gray-300">Resumes Analyzed</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white">100K+</dd>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-y-3 rounded-2xl bg-dark-800 p-8"
          >
            <dt className="text-sm font-semibold leading-6 text-gray-300">Success Rate</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white">85%</dd>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-y-3 rounded-2xl bg-dark-800 p-8"
          >
            <dt className="text-sm font-semibold leading-6 text-gray-300">Job Matches</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white">95%</dd>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
