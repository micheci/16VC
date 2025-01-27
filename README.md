# Peer-to-Peer Rental Platform API

This is a backend API built for a Peer-to-Peer rental platform where users can rent out items such as tools, books, and gadgets. The API supports item listing, searching, renting, and returning items.

##POSTMAN COLLECTION TO TEST
https://vc2222-6452.postman.co/workspace/16vc-Workspace~2af99661-2e4a-4f7e-9ce7-7124d77026de/request/20398198-2b1df4b2-0400-4f0c-94a6-fc1307e0dc07?action=share&creator=20398198&ctx=documentation

Changes:
In the first version, the availability status of an item would change to "unavailable" when rented. While this approach worked, I realized that stores and individuals typically carry multiple units of the same item. To better reflect this, I updated the system to use a quantity field. This change allows users to rent out more than one of the same items if they have multiple units to sell and also will enable people to rent more than one. It also simplifies the array since we won't need to add a new object to the array each time we want to add an existing item and can instead add on to the existing object


## Table of Contents

1. [Installation](#installation)
2. [API Endpoints](#api-endpoints)
   - [List an Item](#list-an-item)
   - [Search Items](#search-items)
   - [Rent an Item](#rent-an-item)
   - [Return an Item](#return-an-item)
3. [Data Storage](#data-storage)

## Installation

To get started with the Peer-to-Peer Rental Platform API:

1. Clone this repository:
   ```
     https://github.com/micheci/16VC.git
   ```

2. Install dependencies:
   ```
   use npm i (saves us 1 blink worth of time jaja vs npm install. Just realized reading this took up more time than a blink, MB)`
   ```

4. Run the API:
   ```
   npm start
   ```

   The server will start at `http://localhost:3000`.

## API Endpoints

\*\* ALL REQUEST HAVE A PREFIX OF /api

### 1. **List an Item**

#### **POST /items**

Add an item available for rent, including details like item name, description, price per day, and quantity.If item exist,we add to the quantity and update item information

#### Request Body:

```json
{
  "name": "GoPro Hero 10",
  "description": "GoPro Hero 10 Action Camera",
  "pricePerDay": 30,
  "quantity": 1
}
```

#### Response:

```json
{
  "id": 4,
  "name": "GoPro Hero 10",
  "description": "GoPro Hero 10 Action Camera",
  "pricePerDay": 30,
  "quantity": 1,
  "rentedCount": 0,
  "rentedDates": []
}
```

### 2. **Search Items**

#### **GET /items**

Search available items filtered by name or price range.

#### Query Parameters:

- `name` (optional): Filter items by name (case-insensitive).
- `minPrice` (optional): Filter items by minimum price per day.
- `maxPrice` (optional): Filter items by maximum price per day.

#### Example Request:

```http
GET /items?name=PS&minPrice=20&maxPrice=40
```

#### Example Response:

```json
[
  {
    "id": 1,
    "name": "PS5",
    "description": "new,never used",
    "pricePerDay": 30,
    "quantity": 1,
    "rentedCount": 0,
    "rentedDates": []
  },
  {
    "id": 2,
    "name": "PS4",
    "description": "good awesome console",
    "pricePerDay": 20,
    "quantity": 1,
    "rentedCount": 0,
    "rentedDates": []
  }
]
```

### 3. **Rent an Item**

#### **POST /:id/rent**

Rent an item for a specified date range. The item must be available during the requested dates. Informs users it will be avaibale and can try again if no time conflicts,else it will inform user that it will not be free.

#### Request Body:

```json
{
  "itemId": 1,
  "startDate": "2025-01-17",
  "endDate": "2025-01-18"
}
```

#### Response:

```json
{
  "id": 1,
  "name": "GoPro Hero 10",
  "description": "GoPro Hero 10 Action Camera",
  "pricePerDay": 30,
  "quantity": 0,
  "rentedCount": 1,
  "rentedDates": [
    {
      "startDate": "2025-01-17",
      "endDate": "2025-01-18"
    }
  ]
}
```

#### Error Response (if the item is already rented during the requested dates):

```json
{
  "error": "These dates are unavailable as they are already rented: 2025-01-28 to 2025-01-30, 2025-01-28 to 2025-01-30."
}
```

### 4. **Return an Item**

#### **POST /:id/return**

Return an item that was previously rented, making it available again.

#### Request Body:

\*dont forget query param for item id

```json
{
  "startDate": "2025-01-17",
  "endDate": "2025-01-18"
}
```

#### Response:

```json
{
  "message": "Item returned successfully.",
  "item": {
    "id": 1,
    "name": "GoPro Hero 10",
    "description": "GoPro Hero 10 Action Camera",
    "pricePerDay": 30,
    "quantity": 1,
    "rentedCount": 0,
    "rentedDates": []
  }
}
```

#### Error Response (if the item wasn't rented for the specified dates):

```json
{
  "error": "Rental not found."
}
```

## Data Storage

Data is stored in-memory for the sake of simplicity (using an array). The following structure is used:

### Item:

```
   let items = [
  {
    id: 1,
    name: "PS5",
    description: "PlayStation 5 Console",
    pricePerDay: 50,
    quantity: 1,
    rentedCount: 0,
    rentedDates: [],
  },
  {
    id: 2,
    name: "Xbox Series X",
    description: "Xbox Series X Console",
    pricePerDay: 45,
    quantity: 2,
    rentedCount: 1,
    rentedDates: [{ startDate: "2025-01-18", endDate: "2025-01-20" }],
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    description: 'Apple MacBook Pro 16" with M1 Pro chip',
    pricePerDay: 120,
    quantity: 5,
    rentedCount: 3,
    rentedDates: [
      { startDate: "2025-01-15", endDate: "2025-01-18" },
      { startDate: "2025-01-20", endDate: "2025-01-22" },
      { startDate: "2025-01-24", endDate: "2025-01-26" },
    ],
  },
];
```

