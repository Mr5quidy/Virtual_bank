// checkAuth.js
const checkAuth = (req, res, next) => {
  // Check if the user session exists
  if (req.session && req.session.user) {
    return next(); // User is authenticated, proceed to next middleware or route handler
  }

  // If no session or user found, return 401 Unauthorized
  return res
    .status(401)
    .json({ message: "Unauthorized. Please log in to continue." });
};

export { checkAuth };
