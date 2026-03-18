# Fridge App

A full-stack application for managing food items in your fridge and grocery list, with automatic product data retrieval from grocery APIs. 
The goal of this project is to make it easier to track what food you have, when it expires, and reduce food waste. Also have an idea of adding some hardware(camera)
inside the fridge which updates fridge db with live tiems. This will be implemented when the app is up and running.

---

# Project Overview

Fridge App allows users to:

* Store and manage items currently in their fridge
* Track expiration dates
* View items sorted by expiration
* Search grocery products from external APIs
* Add products to a grocery list or fridge
* Display product information such as images and brand data

The backend fetches product data from the **Kassalapp API**, while the frontend provides a mobile-friendly interface built with **React Native + Expo**.

---

# 🏗️ Tech Stack

### Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* Custom component structure (`src/components`, `src/pages`, etc.)

### Backend

* Python
* FastAPI
* Uvicorn
* SQLModel
* Requests

### External APIs

* Kassalapp API (product search and metadata)

---

# 📁 Project Structure

```
repo-root
│
├── frontend
│   ├── app                 # Expo router routes
│   ├── src
│   │   ├── components      # Reusable UI components
│   │   ├── pages           # Screens / views
│   │   ├── services        # API calls
│   │   ├── types           # TypeScript types
│   │   └── themes          # Colors, styles
│
├── backend
│   ├── app
│   │   ├── api             # API routes
│   │   ├── models          # SQLModel database models
│   │   ├── services        # External API integrations
│   │   └── database        # Engine and session setup
│   │
│   └── venv                # Python virtual environment (gitignored)
│
└── README.md
```

---

# ⚙️ Backend Setup

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate environment

Mac/Linux

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run server

```bash
uvicorn app.main:app --reload
```

Swagger docs will be available at:

```
http://localhost:8000/docs
```

---

# 📱 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npx expo start
```

---

# 🔎 Kassalapp API Integration

The backend integrates with the **Kassalapp API** to search grocery products.

Example product data returned:

```
{
  "id": 7934,
  "name": "Tine Laktoseredusert Lettmelk 1l",
  "brand": "TINE",
  "ean": "7038010001833",
  "image": "https://cdcimg.coop.no/rte/RTE2/7038010001833.png",
  "current_price": 26.5
}
```

Example backend search function:

```python
def search_for_product(search: str):
    headers = {
        "Authorization": f"Bearer {KASSALAPP_API_KEY}"
    }

    url = f"{BASE_URL}?search={search}"

    response = requests.get(url, headers=headers)
    return response.json()["data"]
```

This allows the frontend to display product images and metadata when searching.

---

# 🧊 Core Features (Current)

### Fridge Management

* Store fridge items
* Expiration tracking
* Sorted by expiration date

### Grocery Product Search

* Search products using Kassalapp API
* Display product images
* Retrieve brand and metadata

### API Testing

* FastAPI Swagger interface
* Search queries via `/docs`

---

# 🗄️ Database

The backend uses **SQLModel** for database models and sessions.

Example fridge item model:

```python
class FridgeItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    expiration_date: datetime
```

The backend automatically generates IDs when storing items.

---

# 🎨 Frontend UI

The frontend uses reusable components such as:

* `FridgeTable`
* `AddItemForm`
* Navigation component (top bar)
* Shared color and theme configuration

Data is retrieved from the backend through a centralized API service.

---

# 🚧 Planned Features

Planned improvements include:

* Advanced filtering and sorting
* Grocery list management
* Automatic receipt scanning
* OCR processing for receipts
* AI-based food recognition
* Barcode scanning
* Product suggestions based on fridge contents

---

# 🔐 Environment Variables

API keys should be stored in environment variables and **never committed**.

Example `.env`:

```
KASSALAPP_API_KEY=your_api_key
```

---

# 🧪 Development Workflow

Recommended workflow:

1. Create feature branch

```
git checkout -b feature-name
```

2. Develop changes

3. Test locally

4. Merge into main branch

---

# 🎯 Goal of the Project

The long-term goal is to create a smart fridge management system that:

* reduces food waste
* improves grocery planning
* automates product tracking

---

# 👨‍💻 Author

Project developed as a full-stack learning project combining:

* React Native mobile development
* Python backend APIs
* external grocery data integration
* modern full-stack architecture
