import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function UploadSection({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please upload a resume');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Prepare FormData for backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      const jobDescriptionBlob = new Blob([
        JSON.stringify({ text: jobDescription })
      ], { type: 'application/json' });
      formData.append('job_description', jobDescriptionBlob);

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onAnalysisComplete(response.data);
      toast.success('Analysis complete!');
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-400 bg-primary-400/10' : 'border-gray-600 hover:border-primary-400'}
          ${selectedFile ? 'bg-primary-400/5' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="flex justify-center">
            <svg
              className={`h-12 w-12 ${isDragActive || selectedFile ? 'text-primary-400' : 'text-gray-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-300">
            {selectedFile ? (
              <p>Selected file: {selectedFile.name}</p>
            ) : (
              <>
                <p className="text-lg font-medium">Drop your resume here</p>
                <p>or click to select (PDF only)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Job Description Input */}
      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2">
          Job Description
        </label>
        <textarea
          id="job-description"
          rows={4}
          className="w-full rounded-lg bg-dark-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary-400 focus:border-primary-400"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isAnalyzing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white 
          ${isAnalyzing 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-primary-400 to-accent-400 hover:opacity-90'
          } transition-all`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing...</span>
          </div>
        ) : (
          'Analyze Resume'
        )}
      </motion.button>
    </div>
  );
}
