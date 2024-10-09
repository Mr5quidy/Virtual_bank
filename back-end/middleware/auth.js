export const checkAuth = (req, res, next) => {
  console.log(req.session);
  if (req.session.user) return next();

  res.status(401).send("Unauthenticated user");
};
