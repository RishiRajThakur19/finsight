from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd
from sklearn.ensemble import IsolationForest

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter(prefix="/ml", tags=["ml"])

@router.get("/fraud-detection")
def detect_fraud(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    transactions = db.query(models.Transaction).all()
    if not transactions:
        return {"error": "No transactions found"}
    
    df = pd.DataFrame([{
        "id": t.id,
        "amount": t.amount,
        "date": t.date,
        "type": t.transaction_type,
        "is_anomaly_true": t.is_anomaly
    } for t in transactions])
    
    model = IsolationForest(contamination=0.1, random_state=42)
    df['anomaly_score'] = model.fit_predict(df[['amount']])
    
    df['is_anomaly_pred'] = df['anomaly_score'] == -1
    
    anomalies = df[df['is_anomaly_pred'] == True]
    
    return {
        "total_transactions": len(df),
        "anomalies_detected": len(anomalies),
        "scatter_data": df[['id', 'amount', 'is_anomaly_pred']].to_dict(orient="records")
    }

@router.get("/bankruptcy-prediction")
def predict_bankruptcy(company: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    data = db.query(models.FinancialData).filter(models.FinancialData.company == company).order_by(models.FinancialData.year.desc()).first()
    if not data:
        return {"error": "Company data not found"}
        
    A = (data.current_assets - data.current_liabilities) / data.assets if data.assets else 0
    B = data.retained_earnings / data.assets if data.assets else 0
    C = data.ebitda / data.assets if data.assets else 0
    D = data.market_value_equity / data.liabilities if data.liabilities else 0
    E = data.sales / data.assets if data.assets else 0
    
    z_score = 1.2*A + 1.4*B + 3.3*C + 0.6*D + 1.0*E
    
    zone = "Safe" if z_score > 2.99 else "Grey" if z_score > 1.8 else "Distress"
    
    return {
        "company": company,
        "z_score": round(z_score, 2),
        "zone": zone,
        "recommendation": "Maintain current strategy" if zone == "Safe" else "Review cost structure" if zone == "Grey" else "Immediate restructuring required"
    }
