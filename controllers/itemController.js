const itemService = require("../services/itemService");

// List an item (Add a new item or update an existing one)
const listItem = (req, res) => {
  const { name, description, pricePerDay, quantity } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Name is required ",
    });
  }

  const item = itemService.addItem(name, description, pricePerDay, quantity);
  return res.status(201).json(item);
};

// Rent an item
const rentItem = (req, res) => {
  const { startDate, endDate } = req.body;
  const itemId = req.params.id;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "startDate and endDate are required",
    });
  }

  const rentedItem = itemService.rentItem(itemId, startDate, endDate);
  if (rentedItem && rentedItem.error) {
    return res.status(400).json({ message: rentedItem.error });
  }

  return res.status(200).json(rentedItem);
};

// Return an item
const returnItem = (req, res) => {
  const { startDate, endDate } = req.body;
  const itemId = req.params.id;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "startDate and endDate are required",
    });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      message: "Invalid date range. Start date cannot be after end date.",
    });
  }

  const returnedItem = itemService.returnItem(itemId, startDate, endDate);

  if (!returnedItem) {
    return res
      .status(404)
      .json({ message: "Rental not found for the provided dates." });
  }

  return res.status(200).json(returnedItem);
};

// Search items
const searchItems = (req, res) => {
  const { name, minPrice, maxPrice } = req.query;
  const items = itemService.searchItems(name, minPrice, maxPrice);
  return res.status(200).json(items);
};

module.exports = {
  listItem,
  rentItem,
  returnItem,
  searchItems,
};
