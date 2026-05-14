import pandas as pd
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
# pyrefly: ignore [missing-import]
import bcrypt
from datetime import datetime

pwd_context = None

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed users
    users = [
        {"email": "analyst@finsight.com", "password": "analyst123", "role": "analyst"},
        {"email": "manager@finsight.com", "password": "manager123", "role": "manager"},
        {"email": "risk@finsight.com", "password": "risk123", "role": "risk"},
    ]

    for u in users:
        db_user = db.query(models.User).filter(models.User.email == u["email"]).first()
        if not db_user:
            hashed_password = get_password_hash(u["password"])
            db_user = models.User(email=u["email"], hashed_password=hashed_password, role=u["role"])
            db.add(db_user)

    db.commit()

    # Seed financial data
    try:
        df_fin = pd.read_csv('data/companies_financial.csv')
        # check if empty
        if db.query(models.FinancialData).count() == 0:
            for _, row in df_fin.iterrows():
                fin_data = models.FinancialData(**row.to_dict())
                db.add(fin_data)
            db.commit()
    except FileNotFoundError:
        print("Financial data CSV not found. Run data_generator.py first.")

    # Seed transactions
    try:
        df_txn = pd.read_csv('data/transactions.csv')
        if db.query(models.Transaction).count() == 0:
            for _, row in df_txn.iterrows():
                txn_dict = row.to_dict()
                txn_dict['date'] = datetime.strptime(txn_dict['date'], '%Y-%m-%d').date()
                txn_data = models.Transaction(**txn_dict)
                db.add(txn_data)
            db.commit()
    except FileNotFoundError:
        print("Transactions CSV not found. Run data_generator.py first.")

    db.close()

if __name__ == "__main__":
    seed()
    print("Database seeded successfully.")
