import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_financial_data():
    companies = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella']
    years = [2019, 2020, 2021, 2022, 2023]
    
    data = []
    for company in companies:
        base_revenue = np.random.randint(500, 5000) * 1000000
        for year in years:
            revenue = base_revenue * (1 + np.random.uniform(-0.1, 0.2))
            profit = revenue * np.random.uniform(0.05, 0.25)
            assets = revenue * np.random.uniform(1.2, 2.5)
            liabilities = assets * np.random.uniform(0.4, 0.8)
            operating_cash_flow = profit * np.random.uniform(0.8, 1.2)
            ebitda = profit * np.random.uniform(1.1, 1.5)
            net_income = profit * np.random.uniform(0.7, 0.9)
            total_equity = assets - liabilities
            current_assets = assets * np.random.uniform(0.3, 0.6)
            current_liabilities = liabilities * np.random.uniform(0.3, 0.6)
            retained_earnings = total_equity * np.random.uniform(0.4, 0.7)
            market_value_equity = total_equity * np.random.uniform(1.0, 3.0)
            sales = revenue
            
            data.append([company, year, revenue, profit, assets, liabilities, operating_cash_flow, 
                         ebitda, net_income, total_equity, current_assets, current_liabilities,
                         retained_earnings, market_value_equity, sales])
            base_revenue = revenue

    df = pd.DataFrame(data, columns=['company', 'year', 'revenue', 'profit', 'assets', 'liabilities',
                                     'operating_cash_flow', 'ebitda', 'net_income', 'total_equity',
                                     'current_assets', 'current_liabilities', 'retained_earnings',
                                     'market_value_equity', 'sales'])
    
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/companies_financial.csv', index=False)

def generate_transactions():
    num_rows = 500
    start_date = datetime(2023, 1, 1)
    
    dates = [start_date + timedelta(days=np.random.randint(0, 365)) for _ in range(num_rows)]
    amounts = np.random.exponential(scale=1000, size=num_rows)
    types = np.random.choice(['Purchase', 'Sale', 'Transfer', 'Fee'], size=num_rows)
    descriptions = [f"Txn {i}" for i in range(num_rows)]
    is_anomaly = np.random.choice([False, True], size=num_rows, p=[0.9, 0.1])
    
    # Make anomalies have extreme amounts
    amounts[is_anomaly] = amounts[is_anomaly] * np.random.uniform(5, 20, size=sum(is_anomaly))
    
    df = pd.DataFrame({
        'date': [d.strftime('%Y-%m-%d') for d in dates],
        'amount': amounts,
        'transaction_type': types,
        'description': descriptions,
        'is_anomaly': is_anomaly
    })
    
    df.to_csv('data/transactions.csv', index=False)

if __name__ == "__main__":
    generate_financial_data()
    generate_transactions()
    print("Sample data generated.")
