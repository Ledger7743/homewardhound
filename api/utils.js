/// this is a handy function that checks if we are logged in ///

function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

function requireUserAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be an Admin in to perform this action",
    });
  }

  next();
}

module.exports = {
  requireUser,
  requireUserAdmin,
};
