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

@app.get('/quote')
def get_quote(ticker: str):
    try:
        df= yf.Ticker(ticker)
        info = df.info.get('currentPrice')
        info2 = df.info.get('previousClose')
        df = yf.download(tickers=ticker, period='1d', interval='1m')
        tp = df['Close']
        timee=[]
        price = []

        for index, value in tp.items():
            time = index.strftime('%H:%M') 
            timee.append(time)
            price.append(round(value,2))

        return { 
            'currentPrice': info,
            'previousPrice' : info2,
            'oneDayQuote': price,
            'oneDayTime' : timee
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)