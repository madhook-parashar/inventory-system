from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import engine, SessionLocal
from .models import Base, Product, Customer, Order

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Inventory Management System API is running"}


# ==========================
# PRODUCTS
# ==========================

@app.post("/products")
def create_product(
    name: str,
    category: str,
    quantity: int,
    price: int,
    db: Session = Depends(get_db)
):
    product = Product(
        name=name,
        category=category,
        quantity=quantity,
        price=price
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    name: str,
    category: str,
    quantity: int,
    price: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    product.name = name
    product.category = category
    product.quantity = quantity
    product.price = price

    db.commit()
    db.refresh(product)

    return product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


# ==========================
# CUSTOMERS
# ==========================

@app.post("/customers")
def create_customer(
    name: str,
    email: str,
    phone: str,
    db: Session = Depends(get_db)
):
    customer = Customer(
        name=name,
        email=email,
        phone=phone
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()


@app.get("/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return {"error": "Customer not found"}

    return customer


@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return {"error": "Customer not found"}

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted"}

# ==========================
# ORDERS
# ==========================

@app.post("/orders")
def create_order(
    customer_id: int,
    product_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return {"error": "Customer not found"}

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return {"error": "Product not found"}

    if product.quantity < quantity:
        return {"error": "Not enough stock"}

    total_price = product.price * quantity

    order = Order(
        customer_id=customer_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )

    product.quantity -= quantity

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@app.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    return order


@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return {"error": "Order not found"}

    db.delete(order)
    db.commit()

    return {"message": "Order deleted"}

# ==========================
# DASHBOARD
# ==========================

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders
    }