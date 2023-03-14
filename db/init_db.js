const {
  client,
  createAdminUser,
  createListing,
  getAllListings,
  createOrders,
  createOrderListings,
  getOrderListingByListingId,
} = require("./");

async function buildTables() {
  try {
    client.connect();
    await client.query(`
            DROP TABLE IF EXISTS order_listings;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS listings;
            `);

    await client.query(`
            CREATE TABLE listings(
                id SERIAL PRIMARY KEY,
                "mostPopular" BOOLEAN DEFAULT false,
                image VARCHAR(500),
                image2 VARCHAR(500),
                image3 VARCHAR(500),
                image4 VARCHAR(500),
                image5 VARCHAR(500),
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                price INTEGER NOT NULL,
                ingredients TEXT NOT NULL,
                );


            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                "mostPopular" BOOLEAN DEFAULT false
            );

            CREATE TABLE orders(
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "isActive" BOOLEAN DEFAULT true,
                total INTEGER DEFAULT 0
            );

            CREATE TABLE order_listings(
                id SERIAL PRIMARY KEY,
                "orderId" INTEGER REFERENCES orders(id),
                "listingId" INTEGER REFERENCES listings(id),
                UNIQUE ("orderId","listingId"),
                quantity INTEGER DEFAULT 1
          
            );

            )`);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    await createAdminUser({
      email: "solan.jellena@gmail.com",
      password: "Cleoismine33",
      firstname: "Jellena",
      lastname: "Solan",
      address: "Toms River, NJ",
    });

    await createListing({
      mostPopular: true,
      image: xxx,
      name: "PB Rocky Rover",
      description: "xxx",
      category: "Treats",
      price: "$9.99",
      ingredients: "Peanut Butter, banana, oat flour, and oats",
    });

    await createListing({
      mostPopular: true,
      image: xxx,
      name: "The GingerPoodle",
      description: "xxx",
      category: "Treats",
      price: "$9.99",
      ingredients:
        "Ground Ginger, Oat flour, Cinnamon, Coconut oil, Buckwheat flour, Unsweetened Applesauce, Pumpkin, and Molasses ",
    });

    await createListing({
      mostPopular: true,
      image: xxx,
      name: "Coco Collies or Coco Cleo's",
      description: "Coconut and PB teats made with love and approved by Cleo",
      category: "Treats",
      price: "$9.99",
      ingredients: "Peanut Butter, banana, oat flour, and oats",
    });

    await createListing({
      mostPopular: false,
      image: xxx,
      name: "The Sensitive Pug",
      description: "Gluten-free, grain-free",
      category: "Treats",
      price: "$9.99",
      ingredients: "Pumpkin, Banana, Buckwheat, Chickpea Flour",
    });

    await createListing({
      mostPopular: false,
      image: xxx,
      name: "The Shredded Couch Potato",
      description: "healthy option, gluten-free, grain-free",
      category: "Treats",
      price: "$8.99",
      ingredients:
        "Sweet potato, buckwheat flour, unsweetened applesauce, shredded carrots, and chickpea flour",
    });

    await createListing({
      mostPopular: false,
      image: xxx,
      name: "Doggie Donuts",
      description: "xxxx",
      category: "Treats",
      price: "$8.99",
      ingredients: "xxx",
    });

    await createListing({
      mostPopular: true,
      image: xxx,
      name: "PB Paws",
      description: "xxx",
      category: "Frozen Treats",
      price: "$8.99",
      ingredients: "plain yogurt, banana, peanut butter",
    });

    await createListing({
      mostPopular: false,
      image: xxx,
      name: "Strawberry Paws",
      description: "healthy option, gluten-free, grain-free",
      category: "Frozen Treats",
      price: "$8.99",
      ingredients: "plain yogurt and strawberry yogurt",
    });

    await createListing({
      mostPopular: false,
      image: xxx,
      name: "Frozen Bones",
      description: "healthy option, gluten-free, grain-free",
      category: "Frozen Treats",
      price: "$8.99",
      ingredients: "Bone Broth",
    });
    await getAllListings();
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
