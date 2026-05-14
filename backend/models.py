# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)

class FinancialData(Base):
    __tablename__ = "financial_data"
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    year = Column(Integer)
    revenue = Column(Float)
    profit = Column(Float)
    assets = Column(Float)
    liabilities = Column(Float)
    operating_cash_flow = Column(Float)
    ebitda = Column(Float)
    net_income = Column(Float)
    total_equity = Column(Float)
    current_assets = Column(Float)
    current_liabilities = Column(Float)
    retained_earnings = Column(Float)
    market_value_equity = Column(Float)
    sales = Column(Float)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    amount = Column(Float)
    transaction_type = Column(String)
    description = Column(String)
    is_anomaly = Column(Boolean, default=False)
