import os
from dotenv import load_dotenv
import requests

load_dotenv(".env.local")

KASSALAPP_API_KEY = os.getenv("KASSALAPP_API_KEY")

BASE_URL = os.getenv("KASSALAPP_API_URL")


def search_for_product(search:str, filter:str = None):
    headers = {
        "Authorization": f"Bearer {KASSALAPP_API_KEY}"
    }

    url = f"{BASE_URL}?search={search}"
    if filter:
        url += f"&sort={filter}"

    response = requests.get(url, headers=headers)
    response = response.json()

    """print(type(response))
    print(response.keys())
    print(len(response["data"]))
    print(response["data"][0].keys())"""

    #first_product = response["data"][0]
    #print("First product:", first_product)
    #print(len(first_product))
    return response["data"]


def clean_product_data(products):
    cleaned_products = []
    for product in products:

        ean = product["ean"]
        price = product["current_price"]

        if ean is None or price is None:
            print(f"Skipping product with missing EAN or price: {product.get('name', 'Unknown')}")
            continue

        cleaned = {
            "id": product.get("id", ""),
            "ean": product.get("ean", ""),
            "name": product.get("name", ""),
            "brand": product.get("brand", ""),
            "price": product.get("current_price", 0),
            "weight": product.get("weight", ""),
            "weight_unit": product.get("weight_unit", ""),
            "image": product.get("image", "")
            }
        
        #print(f"Cleaned product: {cleaned} \n")
        cleaned_products.append(cleaned)
    return cleaned_products

def remove_duplicates(cleaned_products):
    seen_eans = set()
    unique_products = []
    for p in cleaned_products:
        if p["ean"] not in seen_eans:
            unique_products.append(p)
            seen_eans.add(p["ean"])
    
    return unique_products

def filter_products_name(products, search_term):       #search filtering needs more work!!
    filtered = []
    search_term_lower = search_term.lower()
    for product in products:
        if product["name"].lower().startswith(search_term_lower):
            filtered.append(product)
    return filtered

def retrieve_image_urls(products):
    product_image_urls = []
    for p in products:
        name = p["name"]
        image_url = p["image"]
        product_image_urls.append((name, image_url))

    return product_image_urls

def search_and_clean_products(search:str, filter:str = None):
    products = search_for_product(search, filter)                       #returns products matching searchterm
    cleaned_products = clean_product_data(products)                     #removes columns not needed
    unique_products = remove_duplicates(cleaned_products)               #Removes products with missing EAN or price, and keeps only relevant fields
    filtered_products = filter_products_name(unique_products, search)   #Stricter filter on product name, to remove products that only partially match search term
    return filtered_products

def get_product_images(search:str, filter:str = None):
    products = search_and_clean_products(search, filter)
    product_image_urls = retrieve_image_urls(products)
    return product_image_urls
    


if __name__ == "__main__":
    filtered_products = search_and_clean_products()
    url_list = retrieve_image_urls(filtered_products)
    #print(f"Found {len(url_list)} unique products")
    #print(f" product image value: {url_list[0][1]}")