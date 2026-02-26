from fastapi import APIRouter, Query, session, Depends
from services.kassalappAPI.kassalapp import search_and_clean_products

router = APIRouter()

@router.get("/item_search")
def product_search(
    search: str = Query(..., min_length=1, description = "eg. laktosefri lettmelk 1l"),
    filter: str = Query(None, description="optional filter for sorting results, eg. price_asc, price_desc"),
):
    return search_and_clean_products(search=search, filter=filter)