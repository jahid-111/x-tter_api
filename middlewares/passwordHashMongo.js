const { createHmac, randomBytes } = require("crypto");

function hashedUserPassword(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;

  next();
}

async function matchUserSaltHashPass(email, password) {
  try {
    const user = await this.findOne({ email }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    const { salt, password: hashedPassword } = user;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // Compare the hashes
    if (hashedPassword !== userProvidedHash) {
      throw new Error("Incorrect email or password ");
    }

    // Exclude sensitive fields and return the user object
    const { password: _, salt: __, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    // console.error("Error in mathPassword:", error.message);

    // Re-throw the error to be handled by the calling code
    throw new Error(error.message || "Error validating user credentials");
  }
}

module.exports = { hashedUserPassword, matchUserSaltHashPass };
