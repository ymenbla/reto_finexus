from sqlalchemy.orm import Session

from app.repositories.product_repository import ProductRepository
from app.schemas.product_schema import ProductCreate, ProductUpdate

class ProductService:


    def __init__(self, db: Session):
        self.repository = ProductRepository(db)

    def one_product(self, id: int):
        return self.repository.get_by_id(id)

    def all_products(self):
        return self.repository.get_all()


    def new_product(self, product: ProductCreate):
        product_respone = self.repository.create(product)
        return product_respone
    
    def update_product(self, product_id: int, product: ProductUpdate):
        product_respone = self.repository.update(product_id, product)
        return product_respone
    
    def delete_product(self, product_id: int):
        product_respone = self.repository.delete(product_id)
        return product_respone

