import uvicorn
import yfinance as yf
import requests
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


@app.get("/performance")
async def stock_data(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        a = stock.financials
        a = (a.iloc[-1]) / 1000000000000
        b = [date.year for date in a.index]  # Extracting only the year from datetime index
        info = stock.info
        revenue_growth = round(float(info.get('totalRevenue')) / 1000000000000, 2)
        net_income_ttm = round(float(info.get('netIncomeToCommon')) / 1000000000, 2)
        url = f'https://financialmodelingprep.com/api/v3/income-statement/{ticker}?period=annual&apikey=AkOBZnkMiL6VMS9L7W69euvKob9ArH30'
        data = requests.get(url).json()

        formatted_data = []
        years = []
        revenues = []
        net_incomes = []

        for item in data:
            calendarYear = f"{item['calendarYear']}"
            revenue = round(float(item['revenue']) / 1000000000000, 2)
            netIncome = round(float(item['netIncome']) / 1000000000, 2)
            years.append(calendarYear)
            revenues.append(revenue)
            net_incomes.append(netIncome)
            formatted_data.append({calendarYear: (netIncome, revenue)})
        
        # revenue.append(revenue_growth)
        # net_incomes.append(net_income_ttm)
        
        return {'years': years,
                'revenue' : revenues,
                 'net_income':  net_incomes,
                 'profit':  a,
                 'profitYear': b,
                  'revenue_ttm': revenue_growth,
                  'net_income_ttm': net_income_ttm,
                   'formatted_data': formatted_data}
    except Exception as e:
        # print(f"Error fetching stock information for {ticker}: {str(e)}")
        return None
    
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=7500)