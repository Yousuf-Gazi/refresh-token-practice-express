/*  
 * 
 * @param {string[]} roles 
 * @returns 
 */
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Forbidden, You aren't authorized!",
    });
  }
  return next();
};

module.exports = authorize;
