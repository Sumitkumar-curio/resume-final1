from http.server import BaseHTTPRequestHandler
import json
import base64
from io import BytesIO
import PyPDF2
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_text_from_pdf(pdf_bytes):
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

def extract_skills(text):
    skills = set()
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

def extract_education(text):
    education_keywords = r'(?i)(bachelor|master|phd|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?sc|m\.?sc|diploma)'
    education_matches = re.finditer(education_keywords, text)
    return [match.group() for match in education_matches]

def extract_experience(text):
    experience_pattern = r'(?i)(\d+[\+]?\s*(?:year|yr)[s]?\s*(?:of)?\s*experience|\d+[\+]?\s*(?:year|yr)[s]?\s*(?:in|at))'
    experience_matches = re.finditer(experience_pattern, text)
    return [match.group() for match in experience_matches]

def calculate_similarity(text1, text2):
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        return float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except:
        return 0.0

def calculate_ats_score(text, job_desc):
    checks = {
        "has_contact_info": bool(re.search(r'[\w\.-]+@[\w\.-]+', text)),
        "proper_length": 300 <= len(text) <= 1500,
        "has_education": bool(re.search(r'education|degree|university|college', text.lower())),
        "has_experience": bool(re.search(r'experience|work|job|position', text.lower())),
        "has_skills": bool(re.search(r'skills|expertise|proficient|competent', text.lower()))
    }
    
    similarity = calculate_similarity(text, job_desc)
    base_score = sum(checks.values()) / len(checks) * 60
    similarity_score = similarity * 40
    total_score = base_score + similarity_score
    
    return {
        "total_score": round(total_score, 2),
        "similarity_score": round(similarity_score, 2),
        "checks": checks
    }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = json.loads(body)
        
        try:
            # Extract PDF content
            pdf_bytes = base64.b64decode(data['file'])
            text = extract_text_from_pdf(pdf_bytes)
            
            # Extract information
            skills = extract_skills(text)
            education = extract_education(text)
            experience = extract_experience(text)
            
            # Calculate scores
            job_description = data.get('job_description', {}).get('text', '')
            custom_score = calculate_ats_score(text, job_description) if job_description else None
            
            response = {
                "skills": skills,
                "education": education,
                "experience": experience,
                "custom_score": custom_score,
                "text_length": len(text)
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
