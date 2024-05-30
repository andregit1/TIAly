// src/middleware/authorize.js
const authorize = (roles) => {
  // return (req, res, next) => {
  //   if (!req.isAuthenticated()) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }

  //   const userRoles = req.user.roles.map(role => role.name);
  //   const allowed = roles.some(role => userRoles.includes(role));

  //   if (!allowed) {
  //     return res.status(403).json({ message: 'Forbidden' });
  //   }

  //   next();
  // };

  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role.name === role) {
      return next();
    }
    res.status(403).send('Forbidden');
  };
};

module.exports = authorize;
