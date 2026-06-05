from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="A product with this SKU already exists")
    if product.price < 0:
        raise HTTPException(status_code=400, detail="Price cannot be negative")
    if product.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get("/", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, updates: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if updates.name is not None:
        product.name = updates.name
    if updates.price is not None:
        if updates.price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")
        product.price = updates.price
    if updates.quantity is not None:
        if updates.quantity < 0:
            raise HTTPException(status_code=400, detail="Quantity cannot be negative")
        product.quantity = updates.quantity
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}