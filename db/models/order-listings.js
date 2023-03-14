const client = require("../client");

async function createOrderListings(orderId, listingId, quantity) {
  try {
    const {
      rows: [orderListings],
    } = await client.query(
      `
          INSERT INTO order_listings ("orderId", "listingId",quantity) VALUES($1,$2,$3)
          ON CONFLICT ("orderId", "listingId") DO NOTHING
          RETURNING *`,
      [orderId, listingId, quantity]
    );

    await updateOrderPrice(orderId);

    return orderListings;
  } catch (error) {
    console.error(error);
  }
}

async function updateOrderListings({ id, quantity, orderId }) {
  try {
    const {
      rows: [orderListings],
    } = await client.query(
      `
            UPDATE order_listings SET quantity = $1
            WHERE id =$2
            RETURNING *`,
      [quantity, id]
    );

    await updateOrderPrice(orderId);

    return orderListings;
  } catch (error) {
    console.error(error);
  }
}

async function attachListingsToOrders(orders) {
  const ordersToReturn = [...orders];

  try {
    const { rows: listings } = await client.query(`
          SELECT listings.*, order_listings.id 
          AS "orderListingId", order_listings."orderId", order_listings.
          quantity 
          FROM listings
          JOIN order_listings ON order_listings."listingId" = listings.id;
        `);

    for (const order of ordersToReturn) {
      const listingsToAdd = listings.filter(
        (listing) => listing.orderId === order.id
      );
      order.listings = listingsToAdd;
    }

    return ordersToReturn;
  } catch (error) {
    throw error;
  }
}

async function getOrderListingById(id) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT * FROM order_listings
        WHERE id =$1`,
      [id]
    );

    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderListingByListingId(id) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT * FROM order_listings
        WHERE "listingId" =$1`,
      [id]
    );
    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function deleteOrderListing(orderId, listingId) {
  try {
    const { rows: listing } = await client.query(
      `
  DELETE FROM order_listings
  WHERE "orderId" = $1 AND "listingId" = $2`,
      [orderId, listingId]
    );

    await updateOrderPrice(orderId);

    return listing;
  } catch (error) {
    console.error(error);
  }
}

async function updateOrderPrice(orderId) {
  try {
    const { rows: orders } = await client.query(
      `
      SELECT * FROM orders 
      WHERE id =$1`,
      [orderId]
    );

    const allOrders = await attachListingsToOrders(orders);

    let total = 0;

    if (allOrders[0]) {
      allOrders[0].listings.map((listing) => {
        let listingTotal = listing.price * listing.quantity;
        total = total + listingTotal;
      });

      await client.query(
        `
        UPDATE orders SET total = $1
        WHERE id = $2`,
        [total, orderId]
      );
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createOrderListings,
  updateOrderListings,
  attachListingsToOrders,
  getOrderListingById,
  getOrderListingByListingId,
  deleteOrderListing,
};
