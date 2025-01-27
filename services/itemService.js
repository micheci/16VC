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
const getNextId = require("../utility/itemUtility");
/**
 * Add a new item to the system or update its quantity if it already exists.
 * If an item with the same name exists,we update the old version and add on to the current count.
 * etc=> if we have 5 and the new amount is 10 we will end with 15 total
 * Otherwise, a new item is created with a unique ID and added to the list.
 */
const addItem = (name, description, pricePerDay, quantity) => {
  // need this line compare via lowercase to fix SAMEWORD != sameword
  const loweredCaseName = name.trim().toLowerCase();

  let existingItem = items.find(
    (item) => item.name.trim().toLowerCase() === loweredCaseName
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.description = description;
    existingItem.pricePerDay = pricePerDay;
    return existingItem;
  }

  const newItem = {
    id: getNextId(items),
    name,
    description,
    pricePerDay,
    quantity,
    rentedCount: 0,
    rentedDates: [],
  };

  // Add the new item to the list
  items.push(newItem);
  return newItem;
};

/**
 * Rent an item for a specific date range.
 * If a item is available, it is rented.
 * Otherwise, the function checks for conflicts.
 * If date conflict found we inform user they cannot rent
 * Else, if no conflict they will be able to rent once we have the product back
 */
const rentItem = (itemId, startDate, endDate) => {
  const item = items.find((item) => item.id === parseInt(itemId, 10));
  if (!item) return null;

  const normalizeDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const newStartDate = normalizeDate(startDate);
  const newEndDate = normalizeDate(endDate);

  if (item.rentedCount < item.quantity) {
    item.rentedCount += 1;
    item.rentedDates.push({ startDate: newStartDate, endDate: newEndDate });
    return item;
  }

  const conflictingRentals = item.rentedDates.filter(
    (rental) => newStartDate <= rental.endDate && newEndDate >= rental.startDate
  );

  if (conflictingRentals.length > 0) {
    return {
      error: `These dates are unavailable as they are already rented: ${conflictingRentals
        .map((rental) => `${rental.startDate} to ${rental.endDate}`)
        .join(", ")}.`,
    };
  } else {
    // change in future so the dates they choose will automatically be assiged to renter,once the item/s are returned so they dont have to apply later on
    return {
      message: `All units are currently in use, but your selected dates (${startDate} to ${endDate}) are open. Please try again during that time.`,
    };
  }
};

/**
 * Return an item that was previously rented.
 * This function finds the rental based on the item ID and rental dates,
 * removes it from the list of rentals, and adjusts the item's rented count.
 */
const returnItem = (itemId, startDate, endDate) => {
  const item = items.find((item) => item.id === parseInt(itemId));

  if (!item) return null;

  const rentalIndex = item.rentedDates.findIndex(
    (rental) => rental.startDate === startDate && rental.endDate === endDate
  );

  if (rentalIndex === -1) return null;

  item.rentedDates.splice(rentalIndex, 1);
  item.rentedCount -= 1;
  item.quantity += 1;

  return item;
};

/**
 * Search items by name or price range.
 * Filters the items based on partial name matches and/or a price range.
 */
const searchItems = (name, minPrice, maxPrice) => {
  return items.filter((item) => {
    const matchesName = name
      ? item.name.toLowerCase().includes(name.toLowerCase())
      : true;
    const matchesPrice =
      minPrice && maxPrice
        ? item.pricePerDay >= minPrice && item.pricePerDay <= maxPrice
        : true;
    return matchesName && matchesPrice;
  });
};

module.exports = {
  addItem,
  rentItem,
  returnItem,
  searchItems,
};
