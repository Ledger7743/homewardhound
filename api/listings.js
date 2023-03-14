const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingByCategory,
  createListing,
  deleteListing,
  getListingById,
  updateListing,
} = require("../db");
const { requireUser, requireUserAdmin } = require("./utils");

router.get("/", async (req, res, next) => {
  try {
    const listings = await getAllListings();
    res.send(listings);
  } catch (error) {
    next(error);
  }
});

router.get("/:listingId", async (req, res, next) => {
  const { listingId } = req.params;
  try {
    const listings = await getListingById(listingId);
    res.send(listings);
  } catch (error) {
    next(error);
  }
});

router.get("/:category", async (req, res, next) => {
  const { category } = req.params;
  try {
    const listings = await getListingByCategory(category);
    res.send(listings);
  } catch (error) {
    next(error);
  }
});

router.post("/create", requireUserAdmin, async (req, res, next) => {
  const {
    mostPopular,
    image,
    image2,
    image3,
    image4,
    image5,
    name,
    description,
    category,
    price,
    ingredients,
  } = req.body;
  try {
    const createdListing = await createListing({
      mostPopular,
      image,
      image2,
      image3,
      image4,
      image5,
      name,
      description,
      category,
      price,
      ingredients,
    });
    res.send(createdListing);
  } catch (error) {
    next(error);
  }
});

router.patch("/:listingId", requireUserAdmin, async (req, res, next) => {
  const { listingId } = req.params;
  const {
    mostPopular,
    image,
    image2,
    image3,
    image4,
    image5,
    name,
    description,
    category,
    price,
    ingredients,
  } = req.body;
  try {
    const updatedlisting = await updateListing({
      id: listingId,
      mostPopular,
      image,
      image2,
      image3,
      image4,
      image5,
      name,
      description,
      category,
      price,
      ingredients,
    });
    res.send(updatedlisting);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete/:listingId",
  requireUserAdmin,
  async (req, res, next) => {
    const { listingId } = req.params;

    try {
      const deletedListing = await deleteListing(listingId);
      res.send(deletedListing);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
