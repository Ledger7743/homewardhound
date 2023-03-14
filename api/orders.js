const express = require("express");
const {
  getOrdersByUserIsActive,
  createOrders,
  makeOrderInactive,
  deleteOrder,
  getOrdersById,
  getOrdersByUserIsNotActive,
} = require("../db");
const { requireUser, requireUserAdmin } = require("./utils");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserIsActive(req.user.id);

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserIsNotActive(req.user.id);

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const orders = await getOrdersById(id);

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    if (req.user) {
      const order = await createOrders(req.user.id);
      res.send(order);
    } else {
      const order = await createOrders();
      res.send(order);
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/setactive", async (req, res, next) => {
  const { orderId } = req.body;
  try {
    const oldOrder = await makeOrderInactive(orderId);
    res.send(oldOrder);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete", async (req, res, next) => {
  const { orderId } = req.body;
  try {
    const deletedOrder = await deleteOrder(orderId);
    res.send(deletedOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
