import os
from dotenv import load_dotenv
import requests

load_dotenv(".env.local")

KASSALAPP_API_KEY = os.getenv("KASSALAPP_API_KEY")

BASE_URL = os.getenv("KASSALAPP_API_URL")

def get_product_info(search:str, filter:str = None):
    headers = {
        "Authorization": f"Bearer {KASSALAPP_API_KEY}"
    }

    url = f"{BASE_URL}?search={search}"
    if filter:
        url += f"&sort={filter}"

    response = requests.get(url, headers=headers)
    response = response.json()

    print(type(response))
    print(response.keys())
    print(len(response["data"]))
    print(response["data"][0].keys())

    first_product = response["data"][0]
    print("First product:", first_product)
    return response

get_product_info("potet")