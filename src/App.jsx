import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Navigation from './components/Navigation';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
          <Navigation />
          
          <Routes>
            <Route path="/" element={
              <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
                  <div className="flex-1 space-y-6">
                    <motion.h1 
                      className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 animate-gradient bg-300% leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      Optimize Your Resume
                      <br />
                      <span className="text-white">Boost Your Career</span>
                    </motion.h1>
                    
                    <motion.p 
                      className="text-lg text-gray-300 max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      JobFit Analyzer uses advanced AI to analyze your resume against job descriptions,
                      giving you personalized feedback to increase your chances of getting noticed.
                    </motion.p>

                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">85% Improved ATS Scores</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">AI-Powered Analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">Instant Feedback</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Upload Section */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-dark-800 rounded-lg p-8 shadow-xl"
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Try It Now</h2>
                      <UploadSection 
                        onAnalysisComplete={setAnalysisResults}
                        isAnalyzing={isAnalyzing}
                        setIsAnalyzing={setIsAnalyzing}
                      />
                    </motion.div>
                  </div>
                </section>

                {/* Analysis Results */}
                {analysisResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-12"
                  >
                    <AnalysisResults analysis={analysisResults} />
                  </motion.div>
                )}

                {/* Features Section */}
                <Features />

                {/* Pricing Section */}
                <Pricing />
              </main>
            } />
            
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>

          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;