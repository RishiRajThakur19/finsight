from fpdf import FPDF
import os

def generate_report_pdf(company: str, narrative: str):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=15)
    pdf.cell(200, 10, text=f"Financial AI Report - {company}", ln=True, align='C')
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text=narrative)
    
    os.makedirs("data/reports", exist_ok=True)
    file_path = f"data/reports/{company}_report.pdf"
    pdf.output(file_path)
    return file_path
