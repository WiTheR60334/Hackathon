import uvicorn
import yfinance as yf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import math
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
import matplotlib.pyplot as plt
import yfinance as yf
import datetime as dt
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get('/forecast')
def forecast(ticker: str):
    try:
        today = dt.date.today()
        df = yf.download(tickers=ticker, start='2018-01-01', end=today)
        moving_average_100 = sum(df['Close'][-100:]) / 100
        moving_average_200 = sum(df['Close'][-200:]) / 200
        
        if moving_average_100 > moving_average_200:
            trend="Bullish"
        else:
            trend="Bearish"   

        data = df.filter(['Close'])
        dataset = data.values
        data_training_len = math.ceil(len(dataset) * 0.8)

        scaler = MinMaxScaler(feature_range=(0,1))
        data_training_array = scaler.fit_transform(dataset)

        train_data = data_training_array[0:data_training_len, :]
        x_train = []
        y_train = []

        for i in range(60, len(train_data)):
            x_train.append(train_data[i-60:i, 0])
            y_train.append(train_data[i, 0])

        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

        model1 = load_model("Accurate.h5")
        test_data = data_training_array[data_training_len-60:, :]
        x_test = []

        for i in range(60, len(test_data)):
            x_test.append(test_data[i-60:i, 0])

        x_test = np.array(x_test)
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

        predictions = model1.predict(x_test)
        predictions = scaler.inverse_transform(predictions)
        last_60_days = data[-60:].values
        last_60_days_scaled = scaler.fit_transform(last_60_days)
        X_test1 = []
        X_test1.append(last_60_days_scaled)
        X_test1 = np.array(X_test1)
        X_test1 = np.reshape(X_test1, (X_test1.shape[0], X_test1.shape[1], 1))
        pred_price = model1.predict(X_test1)
        pred_price = scaler.inverse_transform(pred_price)

        model2 = load_model("exp4.h5")
        def tomorrows_price(data, scaler, model1):
            last_60_days = data[-60:].values
            last_60_days_scaled = scaler.transform(last_60_days)
            X_test = []
            X_test.append(last_60_days_scaled)
            X_test = np.array(X_test)
            X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
            pred_price = model2.predict(X_test)
            pred_price = scaler.inverse_transform(pred_price)
            return pred_price

        for i in range(365):
            pred_price = tomorrows_price(data, scaler, model1)
            pred_df = pd.DataFrame(pred_price, columns=data.columns)  
            data = pd.concat([data, pred_df], ignore_index=True)

        return { 
            'predictedPrice': float(data.iloc[-1]['Close']),
            'trend' : trend
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=6500)