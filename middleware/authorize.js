const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role.name !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = authorize;
