\# Inventory Management System



\## Overview



A full-stack Inventory Management System built using React, FastAPI, SQLAlchemy, and MySQL.



\## Features



\* Dashboard with statistics

\* Product Management

\* Customer Management

\* Order Management

\* Automatic stock reduction

\* REST API with FastAPI

\* MySQL database integration



\## Technology Stack



\### Frontend



\* React

\* Vite

\* Axios

\* React Router



\### Backend



\* FastAPI

\* SQLAlchemy

\* Uvicorn



\### Database



\* MySQL



\## Installation



\### Backend



pip install -r requirements.txt



uvicorn backend.app.main:app --reload



\### Frontend



cd frontend



npm install



npm run dev



\## API Endpoints



\### Products



\* GET /products

\* POST /products

\* PUT /products/{id}

\* DELETE /products/{id}



\### Customers



\* GET /customers

\* POST /customers

\* DELETE /customers/{id}



\### Orders



\* GET /orders

\* POST /orders

\* DELETE /orders/{id}



\### Dashboard



\* GET /dashboard



