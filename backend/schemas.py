from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class UserBase(BaseModel):
    email: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class FinancialDataSchema(BaseModel):
    id: int
    company: str
    year: int
    revenue: float
    profit: float
    assets: float
    liabilities: float
    operating_cash_flow: float
    ebitda: float
    net_income: float
    total_equity: float
    current_assets: float
    current_liabilities: float
    retained_earnings: float
    market_value_equity: float
    sales: float

    class Config:
        from_attributes = True

class TransactionSchema(BaseModel):
    id: int
    date: date
    amount: float
    transaction_type: str
    description: str
    is_anomaly: bool

    class Config:
        from_attributes = True
