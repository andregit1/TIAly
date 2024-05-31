const authorize = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Fetch the user data with the associated role
      const user = await req.user.reload({ include: 'role' });

      // Check if the user has the required role
      if (!user.role || user.role.name !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }      

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authorize;
