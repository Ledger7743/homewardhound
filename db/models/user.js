const client = require("../client");
// const bcrypt = require("bcrypt");
// const { createOrders } = require("./orders");

async function createUser({ email, password, firstname, lastname, address }) {
  try {
    // const SALT_COUNT = 10;
    //const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users (email, password, firstname, lastname, address) VALUES($1,$2,$3,$4,$5)
            ON CONFLICT (email) DO NOTHING RETURNING *`,
      [email, hashedPassword, firstname, lastname, address]
    );
    await createOrders(user.id);
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function createAdminUser({
  email,
  password,
  firstname,
  lastname,
  address,
}) {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (email, password, firstname, lastname, address, "isAdmin") VALUES($1,$2,$3,$4,$5,true)
      ON CONFLICT (email) DO NOTHING RETURNING *`,
      [email, hashedPassword, firstname, lastname, address]
    );

    await createOrders(user.id);
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmail({ email }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT * FROM users
            WHERE email=$1`,
      [email]
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUser({ email, password }) {
  try {
    const userInfo = await getUserByEmail(email);
    const hashedPassword = userInfo.password;
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (isValid) {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT * FROM users 
        WHERE email = $1 AND password = $2`,
        [email, hashedPassword]
      );

      if (user) {
        delete user.password;
      }

      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
      SELECT id, email, firstname, lastname, address, "isAdmin" FROM users`);

    return users;
  } catch (error) {
    console.error(error);
  }
}

async function updateUser({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (!setString.length) return;
    const {
      rows: [users],
    } = await client.query(
      `
          UPDATE users
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
          `,
      Object.values(fields)
    );

    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users 
      WHERE id =$1`,
      [id]
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  createAdminUser,
  getUserByEmail,
  updateUser,
  getUserById,
};
