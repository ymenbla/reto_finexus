from typing import Optional
from sqlalchemy.orm import Session
from app.models.product_model import Products
from app.schemas.product_schema import ProductCreate, ProductOut, ProductUpdate



class ProductRepository():



    def __init__(self, db: Session):
        self.db = db



    def get_all(self):
        return self.db.query(Products).filter().all()
    


    def get_by_id(self, product_id: int):
        result = self.db.query(Products).filter(Products.id == product_id).first()
        return result


    def create(self, product: ProductCreate):
        
        db_product = Products(
            name = product.name,
            description = product.description,
            price = product.price,
            stock = product.stock,
            category = product.category
        )
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product
    
    def update(self, product_id: int, product: ProductUpdate):
        
        db_product = self.get_by_id(product_id)

        if db_product is not None:

            db_product.name =  product.name
            db_product.description = product.description
            db_product.price = product.price
            db_product.stock = product.stock
            db_product.category = product.category

            self.db.commit()
            self.db.refresh(db_product)
        return db_product
    
    def delete(self, product_id: int):
        db_product = self.get_by_id(product_id)

        if db_product is not None:
            self.db.delete(db_product)
            self.db.commit()
            return True  
        
        return False