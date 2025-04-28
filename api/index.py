from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import PyPDF2
import io
import json
from pydantic import BaseModel
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Resume Analyzer Pro")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined job profiles
JOB_PROFILES = {
    "software_engineer": {
        "title": "Software Engineer",
        "required_skills": [
            "Python", "JavaScript", "Java", "C++", "SQL",
            "algorithms", "data structures", "system design"
        ],
        "description": """
        We are looking for a Software Engineer with:
        - Strong programming skills in Python, JavaScript, or Java
        - Experience with algorithms and data structures
        - Knowledge of system design and architecture
        - Database expertise
        - Problem-solving abilities
        """
    },
    "data_scientist": {
        "title": "Data Scientist",
        "required_skills": [
            "Python", "R", "SQL", "Machine Learning",
            "statistics", "data visualization", "deep learning"
        ],
        "description": """
        Seeking a Data Scientist with:
        - Expertise in Python and R
        - Strong background in machine learning
        - Statistical analysis skills
        - Data visualization experience
        - Big data processing knowledge
        """
    },
    "frontend_developer": {
        "title": "Frontend Developer",
        "required_skills": [
            "HTML", "CSS", "JavaScript", "React",
            "Vue.js", "responsive design", "UI/UX"
        ],
        "description": """
        Looking for a Frontend Developer with:
        - Proficiency in HTML, CSS, and JavaScript
        - Experience with modern frameworks like React
        - Understanding of responsive design
        - UI/UX knowledge
        - Performance optimization skills
        """
    }
}

class JobDescription(BaseModel):
    text: str
    title: Optional[str] = None

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF processing error: {str(e)}")

def extract_skills(text: str) -> List[str]:
    """Extract skills using regex patterns."""
    skills = set()
    
    # Common technical skills patterns
    skill_patterns = {
        'programming_languages': r'\b(python|javascript|java|c\+\+|typescript|ruby|php|swift|kotlin|go|rust)\b',
        'web_technologies': r'\b(html|css|react|angular|vue|node\.?js|express|django|flask|spring)\b',
        'databases': r'\b(sql|mysql|postgresql|mongodb|redis|oracle|elasticsearch)\b',
        'cloud_devops': r'\b(aws|azure|gcp|docker|kubernetes|jenkins|git|ci/cd)\b',
        'data_science': r'\b(machine learning|deep learning|ai|data science|tensorflow|pytorch|pandas|numpy)\b',
        'tools_frameworks': r'\b(webpack|babel|sass|less|jquery|bootstrap|tailwind)\b'
    }
    
    text_lower = text.lower()
    for category, pattern in skill_patterns.items():
        matches = re.finditer(pattern, text_lower)
        skills.update(match.group() for match in matches)
    
    return sorted(list(skills))

def extract_education(text: str) -> List[str]:
    """Extract education information using regex."""
    education_keywords = r'(?i)(bachelor|master|phd|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?sc|m\.?sc|diploma)'
    education_matches = re.finditer(education_keywords, text)
    return [match.group() for match in education_matches]

def extract_experience(text: str) -> List[str]:
    """Extract experience information using regex."""
    experience_pattern = r'(?i)(\d+[\+]?\s*(?:year|yr)[s]?\s*(?:of)?\s*experience|\d+[\+]?\s*(?:year|yr)[s]?\s*(?:in|at))'
    experience_matches = re.finditer(experience_pattern, text)
    return [match.group() for match in experience_matches]

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate text similarity using TF-IDF and cosine similarity."""
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        return float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except:
        return 0.0

def calculate_ats_score(text: str, job_desc: str) -> Dict:
    """Calculate ATS compatibility score."""
    # Basic ATS checks
    checks = {
        "has_contact_info": bool(re.search(r'[\w\.-]+@[\w\.-]+', text)),
        "proper_length": 300 <= len(text) <= 1500,
        "has_education": bool(re.search(r'education|degree|university|college', text.lower())),
        "has_experience": bool(re.search(r'experience|work|job|position', text.lower())),
        "has_skills": bool(re.search(r'skills|expertise|proficient|competent', text.lower()))
    }
    
    # Calculate similarity score
    similarity = calculate_similarity(text, job_desc)
    
    # Calculate overall score
    base_score = sum(checks.values()) / len(checks) * 60  # Base score out of 60
    similarity_score = similarity * 40  # Similarity score out of 40
    total_score = base_score + similarity_score
    
    return {
        "total_score": round(total_score, 2),
        "similarity_score": round(similarity_score, 2),
        "checks": checks
    }

async def parse_job_description(
    job_description: UploadFile = File(None)
) -> Optional[JobDescription]:
    """Parse job description from form data."""
    if not job_description:
        return None
    
    try:
        content = await job_description.read()
        data = json.loads(content.decode())
        return JobDescription(**data)
    except:
        return None

@app.post("/api/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[JobDescription] = Depends(parse_job_description)
) -> Dict:
    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
        
        # Extract information using regex
        skills = extract_skills(text)
        education = extract_education(text)
        experience = extract_experience(text)
        
        # Calculate scores for each job profile
        profile_scores = {}
        for profile_id, profile in JOB_PROFILES.items():
            score = calculate_ats_score(text, profile["description"])
            profile_scores[profile["title"]] = score
        
        # Calculate custom score if job description provided
        custom_score = None
        if job_description:
            custom_score = calculate_ats_score(text, job_description.text)
        
        return {
            "skills": skills,
            "education": education,
            "experience": experience,
            "profile_scores": profile_scores,
            "custom_score": custom_score,
            "text_length": len(text)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/job-profiles")
async def get_job_profiles():
    return JOB_PROFILES

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
