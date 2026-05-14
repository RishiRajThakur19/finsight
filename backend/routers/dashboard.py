from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/companies", response_model=List[str])
def get_companies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    companies = db.query(models.FinancialData.company).distinct().all()
    return [c[0] for c in companies]

@router.get("/financials", response_model=List[schemas.FinancialDataSchema])
def get_financials(company: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.FinancialData)
    if company:
        query = query.filter(models.FinancialData.company == company)
    return query.order_by(models.FinancialData.year).all()

@router.get("/ratios")
def get_ratios(company: str, year: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.FinancialData).filter(models.FinancialData.company == company)
    if year:
        query = query.filter(models.FinancialData.year == year)
    
    data = query.order_by(models.FinancialData.year.desc()).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    
    current_ratio = data.current_assets / data.current_liabilities if data.current_liabilities else 0
    debt_to_equity = data.liabilities / data.total_equity if data.total_equity else 0
    profit_margin = data.net_income / data.revenue if data.revenue else 0
    return {
        "current_ratio": {"value": round(current_ratio, 2), "status": "healthy" if current_ratio > 1.5 else "warning"},
        "debt_to_equity": {"value": round(debt_to_equity, 2), "status": "healthy" if debt_to_equity < 1.0 else "critical"},
        "profit_margin": {"value": round(profit_margin * 100, 2), "status": "healthy" if profit_margin > 0.1 else "warning"},
    }

@router.get("/transactions", response_model=List[schemas.TransactionSchema])
def get_transactions(limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Transaction).order_by(models.Transaction.date.desc()).limit(limit).all()
