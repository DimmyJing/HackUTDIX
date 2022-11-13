import json

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("final_result.json") as f:
    data = json.load(f)

with open("user_map.json") as f:
    user_info = json.load(f)

beta_map = {}
value_map = {}
for i, j in data.items():
    if j["beta"] is not None and j["currentPrice"] is not None:
        beta_map[i] = j["beta"]
        value_map[i] = j["currentPrice"]

thing = []
for i, j in beta_map.items():
    thing.append(j)


def normalize(beta_value):
    return (beta_value + 26.34494 + 0.1) / (142.730865 - 0.2)


@app.get("/sign_up_email/{email}")
async def sign_up_email(email):
    if email not in user_info:
        user_info[email] = {}


@app.get("/get_info/{ticker}")
async def get_info(ticker):
    if ticker in value_map:
        return {"price": value_map[ticker], "std": normalize(beta_map[ticker])}
    return {}


@app.get("/put_ticker/{email}/{ticker}/{amount}/{confidence}")
async def put_ticker(email, ticker, amount, confidence):
    if email not in user_info:
        user_info[email] = {}
    if ticker not in data:
        return {}
    user_info[email][ticker] = {
        "amount": amount,
        "confidence": confidence,
        "type": "Stock",
    }
    with open("user_map.json", "w") as f:
        json.dump(user_info, f)


@app.get("/get_tickers/{email}")
async def get_tickers(email):
    if email not in user_info:
        user_info[email] = {}
    return {i: j for i, j in user_info[email].items() if i != "config"}


@app.get("/remove_ticker/{email}/{ticker}")
async def remove_ticker(email, ticker):
    if email not in user_info:
        user_info[email] = {}
    if ticker in user_info[email]:
        del user_info[email][ticker]
    with open("user_map.json", "w") as f:
        json.dump(user_info, f)


@app.get("/set_user_data/{email}/{exp_return}/{assets}")
async def set_user_data(email, exp_return, assets):
    if email not in user_info:
        user_info[email] = {}
    user_info[email]["config"] = {"exp_return": exp_return, "assets": assets}
    with open("user_map.json", "w") as f:
        json.dump(user_info, f)


@app.get("/get_user_data/{email}")
async def get_user_data(email):
    if email not in user_info:
        user_info[email] = {}
    if "config" not in user_info[email]:
        return {"exp_return": 0, "assets": 0}
    return user_info[email]["config"]


@app.get("/get_recommended/{email}")
async def get_recommended(email):
    if email not in user_info:
        user_info[email] = {}
    if "config" not in user_info[email]:
        user_info[email]["config"] = {"exp_return": 0, "assets": 0}
    expected_return = int(user_info[email]["config"]["exp_return"]) / 100 + 0.1
    stocks = [((normalize(j) - expected_return) ** 2, i) for i, j in beta_map.items()]
    stocks.sort()
    return [
        {"ticker": i, "mean": value_map[i], "std": normalize(beta_map[i])}
        for _, i in stocks[:3]
    ]


@app.get("/")
async def main():
    return {"message": "Hello World"}
