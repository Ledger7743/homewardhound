const client = require("../client");

const { attachListingsToOrders } = require("./order-listings");

async function createOrders(userId) {
  try {
    const { rows: orders } = await client.query(
      `
        INSERT INTO orders ("userId") VALUES($1)
        RETURNING *`,
      [userId]
    );
    return attachListingsToOrders(orders);
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersById(id) {
  try {
    const { rows: orders } = await client.query(
      `
      SELECT * FROM orders 
      WHERE id =$1`,
      [id]
    );
    return attachListingsToOrders(orders);
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByIsActive(isActive) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT * FROM orders 
        WHERE "isActive" =$1`,
      [isActive]
    );

    return attachListingsToOrders(orders);
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByUserIsActive(userId) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT * FROM orders 
        WHERE "isActive" =true AND "userId" =$1`,
      [userId]
    );

    return attachListingsToOrders(orders);
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByUserIsNotActive(userId) {
  try {
    const { rows: orders } = await client.query(
      `
        SELECT * FROM orders 
        WHERE "isActive" =false AND "userId" =$1`,
      [userId]
    );

    return attachListingsToOrders(orders);
  } catch (error) {
    console.error(error);
  }
}

async function deleteOrder(id) {
  try {
    await client.query(
      `
    DELETE FROM order_listings
    WHERE "orderId" = $1
    `,
      [id]
    );
    const { rows: order } = await client.query(
      `
    DELETE FROM orders 
    WHERE id=$1 
    RETURNING * `,
      [id]
    );
    return order;
  } catch (error) {
    console.error(error);
  }
}

async function makeOrderInactive(id) {
  try {
    const { rows: order } = await client.query(
      `
    UPDATE orders 
    SET "isActive" = false
    WHERE id=$1 
    RETURNING * `,
      [id]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createOrders,
  getOrdersById,
  getOrdersByIsActive,
  getOrdersByUserIsActive,
  deleteOrder,
  makeOrderInactive,
  getOrdersByUserIsNotActive,
};
