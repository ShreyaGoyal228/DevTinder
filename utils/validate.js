const validator = require("validator");
function validateEditProfileData(req) {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "photoUrl",
    "about",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  return isUpdateAllowed;
}

function strongPasswordChecker(password) {
  const isStrongPass = validator.isStrongPassword(password);
  return isStrongPass;
}

module.exports = { validateEditProfileData, strongPasswordChecker };
