const adminAuth = (req, res, next) => {
  // const token=req.body.token
  console.log("Admin auth is getting checked.");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request.");
  }
};

const userAuth = (req, res, next) => {
  // const token=req.body.token
  console.log("User auth is getting checked.");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request.");
  }
};

module.exports = { adminAuth, userAuth };
