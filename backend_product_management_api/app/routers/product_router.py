from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db

from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductOut
from app.services.product_service import ProductService

product = APIRouter(tags=["products"])

@product.get("/products/{id}", response_model=ProductOut)
def one_product(
    id: int, 
    db: Session = Depends(get_db)
):
    
    return ProductService(db).one_product(id)

@product.get("/products", response_model=list[ProductOut])
def all_product(
    db: Session = Depends(get_db)
):
    
    return ProductService(db).all_products()


@product.post("/products", response_model=ProductOut)
def put_product(
    payload: ProductCreate, db: Session = Depends(get_db)
):
    
    print("payload",payload)
    return ProductService(db).new_product(product=payload)


@product.put("/products/{id}", response_model=ProductOut)
def put_product(
    id: int, 
    payload: ProductUpdate, 
    db: Session = Depends(get_db)
):
    return ProductService(db).update_product(product_id=id, product=payload)


@product.delete("/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
def put_product(
    id: int, 
    db: Session = Depends(get_db)
):
    product_deleted = ProductService(db).delete_product(id)
    if not product_deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return None