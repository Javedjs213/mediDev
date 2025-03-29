import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; 

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    console.log(req.user); 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
