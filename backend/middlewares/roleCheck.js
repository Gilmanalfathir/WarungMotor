// backend/middlewares/roleCheck.js

/**
 * Middleware untuk memeriksa role pengguna
 * @param {string[]} allowedRoles - Daftar role yang diizinkan
 * @returns {Function} Middleware express
 */
module.exports = (allowedRoles = []) => {
    return (req, res, next) => {
      // Periksa apakah req.user ada
      if (!req.user) {
        return res.status(401).json({ 
          msg: 'Unauthorized: No user information' 
        });
      }
  
      // Normalisasi roles menjadi array jika bukan
      const roles = Array.isArray(allowedRoles) 
        ? allowedRoles 
        : [allowedRoles];
  
      // Periksa apakah role pengguna ada dalam daftar yang diizinkan
      const hasPermission = roles.some(role => 
        req.user.role === role
      );
  
      // Jika tidak memiliki izin, tolak akses
      if (!hasPermission) {
        return res.status(403).json({ 
          msg: 'Access denied: Insufficient permissions',
          requiredRoles: roles,
          userRole: req.user.role
        });
      }
  
      // Lanjutkan ke middleware/route selanjutnya
      next();
    };
};