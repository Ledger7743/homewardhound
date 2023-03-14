const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { requireUser, requireUserAdmin } = require("./utils");
const {
  getUserByEmail,
  createUser,
  getUserById,
  getAllUsers,
} = require("../db");

router.post("/register", async (req, res, next) => {
  const { email, password, firstname, lastname, address } = req.body;
  try {
    const _user = await getUserByEmail({ email });

    if (_user) {
      next({
        error: "UserExistsError",
        name: "UserExistsError",
        message: ` ${email} is already taken.`,
      });
    }
    if (password.length < 8) {
      next({
        error: "PasswordTooShortError",
        name: "PasswordTooShortError",
        message: "Password Too Short! Needs 8 Characters.",
      });
    }

    const user = await createUser({
      email,
      password,
      firstname,
      lastname,
      address,
    });

    if (user != undefined) {
      const token = jwt.sign(
        {
          id: user.id,
          email,
        },

        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "thank you for signing up",
        token: token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByEmail({ email });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET
        );
        delete user.password;
        user.token = token;

        res.send({ user: user, message: "you're logged in!", token: token });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Email or password is incorrect",
        });
      }
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/info", requireUser, async (req, res, next) => {
  try {
    const userInfo = await getUserById(req.user.id);
    res.send(userInfo);
  } catch (error) {
    next(error);
  }
});

router.get("/allusers", requireUserAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
