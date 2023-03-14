const client = require("../client");

const capitalName = (name) => {
  const result = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return result;
};

async function createListing({
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
}) {
  try {
    const {
      rows: [listing],
    } = await client.query(
      `
            INSERT INTO listings ("mostPopular", image, image2, image3, image4, image5, name, description, category, price, ingredients) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
      [
        mostPopular,
        image,
        image2,
        image3,
        image4,
        image5,
        name,
        description,
        capitalName(category),
        price,
        ingredients,
      ]
    );

    return listing;
  } catch (error) {
    console.error(error);
  }
}

async function getAllListings() {
  try {
    const { rows: listings } = await client.query(`
        SELECT * FROM listings`);

    return attachReviewsToListings(listings);
  } catch (error) {
    console.error(error);
  }
}

async function getListingById(id) {
  try {
    const { rows: listings } = await client.query(
      `
        SELECT * FROM listings
        WHERE id = $1`,
      [id]
    );

    return attachReviewsToListings(listings);
  } catch (error) {
    console.error(error);
  }
}

async function updateListing({ id, ...fields }) {
  const filteredObject = Object.fromEntries(
    Object.entries(fields).filter(([key, val]) => val !== "")
  );

  const setString = Object.keys(filteredObject)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (!setString.length) return;
    const {
      rows: [listing],
    } = await client.query(
      `
          UPDATE listings
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(filteredObject)
    );

    return listing;
  } catch (error) {
    console.error(error);
  }
}

async function deleteListing(id) {
  try {
    await client.query(
      `
          DELETE FROM review_listings
          WHERE "listingId" = $1
          RETURNING *;
          `,
      [id]
    );

    await client.query(
      `
          DELETE FROM order_listings
          WHERE "listingId" = $1
          RETURNING *;
          `,
      [id]
    );

    const { rows } = await client.query(
      `
          DELETE FROM listings
          WHERE id = $1
          RETURNING *;
          `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getListingByCategory(category) {
  try {
    const { rows: listing } = await client.query(
      `
        SELECT * FROM listings 
        WHERE category =$1`,
      [capitalName(category)]
    );
    return attachReviewsToListings(listing);
  } catch (error) {
    console.error(error);
  }
}

async function getListingByName(name) {
  try {
    const {
      rows: [listing],
    } = await client.query(
      `
        SELECT * FROM listings 
        WHERE name =$1`,
      [name]
    );

    return attachReviewsToListings(listing);
  } catch (error) {
    console.error(error);
  }
}

async function getListingByMostPopular(mostPopular) {
  try {
    const { rows: listing } = await client.query(
      `
        SELECT * FROM listings 
        WHERE "mostPopular" =$1`,
      [mostPopular]
    );

    return attachReviewsToListings(listing);
  } catch (error) {
    console.error(error);
  }
}

async function getListingByPrice(price) {
  try {
    const { rows: listing } = await client.query(
      `
        SELECT * FROM listings 
        WHERE price =$1`,
      [price]
    );

    return attachReviewsToListings(listing);
  } catch (error) {
    console.error(error);
  }
}

async function attachReviewsToListings(listings) {
  const listingsToReturn = [...listings];

  try {
    const { rows: reviews } = await client.query(`
            SELECT reviews.*, review_listings.id 
            AS "reviewListingId", review_listings."listingId"
            FROM reviews
            JOIN review_listings ON review_listings."reviewId" = reviews.id;
          `);

    for (const listing of listingsToReturn) {
      const reviewsToAdd = reviews.filter(
        (review) => review.listingId === listing.id
      );
      listing.reviews = reviewsToAdd;
    }

    return listingsToReturn;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createListing,
  getAllListings,
  deleteListing,
  getListingByCategory,
  getListingByMostPopular,
  getListingByName,
  getListingByPrice,
  getListingById,
  updateListing,
};
