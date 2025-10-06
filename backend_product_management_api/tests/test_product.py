from decimal import Decimal
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config.db import Base, get_db
from app.main import app

# 🚀 Base de datos temporal en memoria
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🔧 Sobrescribir la dependencia get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Reemplazamos la BD real por la temporal
app.dependency_overrides[get_db] = override_get_db

# Creamos las tablas para los tests
Base.metadata.create_all(bind=engine)

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Se ejecuta una sola vez antes de las pruebas."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_create_product():
    payload = {
        "name": "Producto Test",
        "description": "Descripción de prueba",
        "price": 99.99,
        "stock": 10,
        "category": "Electrónicos"
    }
    response = client.post("/api/products", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == payload.get("name")
    assert data["description"] == payload.get("description")
    assert Decimal(data["price"]) == Decimal(f"{payload.get("price")}")
    assert Decimal(data["stock"]) == Decimal(f"{payload.get("stock")}")
    assert data["category"] == payload.get("category")
    
    global product_id
    product_id = data["id"]


def test_get_all_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_one_product():
    response = client.get("/api/products/1")
    assert response.status_code in (200, 404)


def test_update_product():
    updated_product_data = {
        "id": product_id,
        "name": "Taladro Bosch GSB 13RE",
        "description": "Taladro percutor 750W con maletín",
        "price": 135.99,
        "stock": 23,
        "category": "Ferreteria"
    }
    response = client.put(f"/api/products/{product_id}", json=updated_product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["name"] == updated_product_data["name"]
    assert data["description"] == updated_product_data["description"]
    assert Decimal(data["price"]) == Decimal(f"{updated_product_data["price"]}")
    assert Decimal(data["stock"]) == Decimal(f"{updated_product_data["stock"]}")
    assert data["category"] == updated_product_data["category"]


def test_delete_product():
    response = client.delete(f"/api/products/{product_id}")
    assert response.status_code == 204  # No content

