from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ─── Product Schemas ───────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None


class Product(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Customer Schemas ──────────────────────────────────────────
class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str


class Customer(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Order Schemas ─────────────────────────────────────────────
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class Order(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}