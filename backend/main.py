from fastapi import FastAPI


#app entrypoint
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}