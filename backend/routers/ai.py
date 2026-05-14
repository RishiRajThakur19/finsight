# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from groq import Groq
import os

import models
from database import get_db
from routers.auth import get_current_user
from utils.pdf_generator import generate_report_pdf

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/report")
def generate_ai_report(company: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    data = db.query(models.FinancialData).filter(models.FinancialData.company == company).order_by(models.FinancialData.year.desc()).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
        
    prompt = f"Analyze the following financial data for {company} in {data.year}:\n"
    prompt += f"Revenue: {data.revenue}, Profit: {data.profit}, Assets: {data.assets}, Liabilities: {data.liabilities}.\n"
    prompt += "Provide a brief executive summary, key risks, and recommendations."
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key or groq_api_key == "your_groq_api_key_here":
        narrative = "Demo Mode Narrative: The company shows strong revenue growth but high liabilities. Recommend focusing on debt reduction. (Please set valid GROQ_API_KEY for real AI response)."
    else:
        try:
            client = Groq(api_key=groq_api_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=500
            )
            narrative = completion.choices[0].message.content
        except Exception as e:
            narrative = f"Error generating report: {str(e)}"
            
    return {"company": company, "narrative": narrative}

@router.get("/report/pdf")
def download_ai_report(company: str, narrative: str, current_user: models.User = Depends(get_current_user)):
    file_path = generate_report_pdf(company, narrative)
    return FileResponse(file_path, media_type='application/pdf', filename=f"{company}_Financial_Report.pdf")

from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/chat")
def ai_chat(request: ChatRequest, current_user: models.User = Depends(get_current_user)):
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key or groq_api_key == "your_groq_api_key_here":
        return {"response": "Demo Mode Narrative: I am analyzing the current data context. (Please set valid GROQ_API_KEY for real AI response)."}
    
    try:
        client = Groq(api_key=groq_api_key)
        
        # Convert pydantic models to dicts for Groq
        formatted_messages = [{"role": "system", "content": "You are FinSight AI, an expert financial analyst assistant. Provide concise, professional answers."}]
        for msg in request.messages:
            # Only user and assistant roles are sent from frontend, Groq accepts these.
            formatted_messages.append({"role": msg.role, "content": msg.content})
            
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            temperature=0.7,
            max_tokens=300
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": f"Error generating response: {str(e)}"}
