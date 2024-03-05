import uvicorn
import yfinance as yf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/stock_data")
async def stock_data(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        trailing_pe_ratio = info.get('trailingPE', None)
        dividend_yield = info.get('dividendYield', None) * 100 if info.get('dividendYield', None) is not None else None
        pb_ratio = info.get('priceToBook', None)
        market_cap = round(info.get('marketCap', None) / 10**12, 2) if info.get('marketCap', None) is not None else None
        revenue_growth = info.get('revenueGrowth', 'N/A')
        profitMargin = info.get('profitMargins', 'N/A')
        about = info.get('longBusinessSummary', 'N/A')
        sector = info.get('sector', 'N/A')
        industry = info.get('industry', 'N/A')
        city = info.get('city', 'N/A')
        country = info.get('country', 'N/A')
        website = info.get('website', 'N/A')
        fullTimeEmployees = info.get('fullTimeEmployees', 'N/A')
        phone = info.get('phone', 'N/A')
        short_name = info.get('shortName', 'N/A')
        symbol = info.get('symbol', 'N/A')
        currency = info.get('financialCurrency', 'N/A')
        debt_equity = round(info.get('debtToEquity', None), 2) if info.get('debtToEquity', None) is not None else None

        return {
            "trailing_pe_ratio": round(trailing_pe_ratio, 2) if trailing_pe_ratio is not None else None,
            "dividend_yield": dividend_yield,
            "pb_ratio": round(pb_ratio, 2) if pb_ratio is not None else None,
            "market_cap": market_cap,
            "revenue_growth": revenue_growth,
            "profitMargin": profitMargin,
            "about": about,
            "short_name": short_name,
            "sector" : sector,
            "city" : city,
            "country" : country,
            "industry" : industry,
            "website" : website,
            "fullTimeEmployees" : fullTimeEmployees,
            "phone" : phone,
            "symbol": symbol,
            "currency": currency,
            "debt_equity": debt_equity
        }
    except Exception as e:
        print(f"Error fetching stock information for {ticker}: {str(e)}")
        return None
    
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=7000)