from fastapi import APIRouter, Query, Depends
from fastapi.responses import HTMLResponse
from services.kassalappAPI.kassalapp import search_and_clean_products, get_product_images

router = APIRouter()

@router.get("/item_search")
def product_search(
    search: str = Query(..., min_length=1, description = "eg. laktosefri lettmelk 1l"),
    filter: str = Query(None, description="optional filter for sorting results, eg. price_asc, price_desc"),
):
    return search_and_clean_products(search=search, filter=filter)

@router.get("/product_images")
def show_item_images(
    search: str = Query(..., min_length=1, description = "eg. laktosefri lettmelk 1l"),
    filter: str = Query(None, description="optional filter for sorting results, eg. price_asc, price_desc")
    ):
    product_url_list = get_product_images(search=search, filter=filter)

    return product_url_list