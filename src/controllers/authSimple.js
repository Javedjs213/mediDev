import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Patient, Doctor, NGO } from "../models/authModel.js";

const SECRET_KEY = "your_secret_key"; // Use an environment variable in production


export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role  } = req.body;

    console.log(fullName, email, password, role);

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let UserModel, userData;
    if (role === "patient") {
      UserModel = Patient;
      userData = { fullName, email, role};
      const { age, gender, location } = req.body;

      if(age){
        userData.age = age;
      }
      if(gender){
        userData.gender = gender;
      }
      if(location){
        userData.location = location;
      }

      console.log(userData, "userData in patient signup controller");

    } else if (role === "doctor") {
      UserModel = Doctor;
      userData = { fullName, email, role};
      const { licenseNumber, specialization, experience } = req.body;

      if(licenseNumber){
        userData.licenseNumber = licenseNumber;
      }
      if(specialization){
        userData.specialization = specialization;
      }
      if(experience){
        userData.experience = experience;
      }

      console.log(userData, "userData in Doctor signup controller");

    } else if (role === "ngo") {
      UserModel = NGO;
    
      // ✅ Initialize userData before assigning properties
      userData = { fullName, email, role };
    
      const { missionStatement, certifications, address, websiteUrl } = req.body;
      console.log(certifications, address, websiteUrl);
    
      if (missionStatement && missionStatement.length > 0) {
        userData.missionStatement = missionStatement;
      }
    
      if (certifications && certifications.length > 0) {
        userData.certifications = certifications;
      }
      
      if (address && address.trim() !== "") {
        userData.address = address;
      }
      
      if (websiteUrl && websiteUrl.trim() !== "") {
        userData.websiteUrl = websiteUrl;
      }
    
      console.log(userData, "userData in NGO signup controller");
    } else {
      return res.status(400).json({ message: "Invalid role provided." });
    }


    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    // Create user
    // const newUser = new UserModel({
    //   fullName,
    //   email,
    //   password: hashedPassword,
    //   role,
    // });
    const newUser = new UserModel(userData);

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: "7d" });

    res.status(201).json({ message: "Signup successful!", token, user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// export const signup = async (req, res) => {
//   try {
//     const { fullName, email, password, role } = req.body;

//     console.log(fullName, email, password, role);

//     if (!fullName || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     let UserModel;
//     if (role === "patient") {
//       UserModel = Patient;
//     } else if (role === "doctor") {
//       UserModel = Doctor;
//     } else if (role === "ngo") {
//       UserModel = NGO;
//     } else {
//       return res.status(400).json({ message: "Invalid role provided." });
//     }


//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists." });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = new UserModel({
//       fullName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await newUser.save();

//     // Generate JWT Token
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: "7d" });

//     res.status(201).json({ message: "Signup successful!", token, user: newUser });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };




export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let UserModel;
    if (role === "patient") {
      UserModel = Patient;
    } else if (role === "doctor") {
      UserModel = Doctor;
    } else if (role === "ngo") {
      UserModel = NGO;
    } else {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful!", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error Here" });
  }


};





export const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully!" });
};


export const iam = (req, res) => {
  const { user } = req; // Extract user from request object
  console.log("Iam :", user);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Return user information
  res.status(200).json({ message: "User information", user });
}



/** Middleware to Protect Routes */
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
