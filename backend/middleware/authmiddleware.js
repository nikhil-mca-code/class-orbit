const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ message: "Authentication is unavailable" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req,res,next)=>{
  if(req.user.role!=="admin") return res.status(403).json({ message: "Admin only" });
  next();
};

exports.isStudent = (req,res,next)=>{
  if(req.user.role!=="student") return res.status(403).json({ message: "Student only" });
  next();
};

exports.isTeacher = (req,res,next)=>{
  if(req.user.role!=="teacher") return res.status(403).json({ message: "Teacher only" });
  next();
};
