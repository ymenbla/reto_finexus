from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator


class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=255)
    price: Decimal = Field(..., gt=0, description="Debe ser un valor mayor que 0")
    stock: int = Field(..., ge=0, description="Debe ser un número entero mayor o igual que 0")
    category: Optional[str] = Field(None, max_length=255)

    # @field_validator("price")
    # @classmethod
    # def validate_price_precision(cls, value: Decimal) -> Decimal:
    #     if value.as_tuple().exponent < -2:
    #         raise ValueError("El precio solo puede tener hasta 2 decimales")
    #     return value


class ProductCreate(Product):
    pass


class ProductIn(Product):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ProductUpdate(ProductIn):
    pass

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: Decimal
    stock: int
    category: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True