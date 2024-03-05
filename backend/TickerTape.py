import uvicorn
import yfinance as yf
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get('/chart')
async def chart(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info.get('previousClose')
        info2 = stock.info.get('currentPrice')
        data = {'firstValue': info, 'currentValue': info2}
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5000)