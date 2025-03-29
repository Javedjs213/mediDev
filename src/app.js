import express from "express";
import session from "express-session";
import bodyParser from "body-parser"; 

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, Patient, Doctor, NGO } from "./models/authModel.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(express.json());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use('multi-role-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const { role } = req.body;
    
    let user;
    switch(role) {
      case 'doctor':
        user = await Doctor.findOne({ email });
        break;
      case 'patient':
        user = await Patient.findOne({ email });
        break;
      case 'ngo':
        user = await NGO.findOne({ email });
        break;
      default:
        return done(null, false, { message: 'Invalid role' });
    }
    
    if (!user) return done(null, false, { message: `${role} not found` });
    
    const isValid = await user.isValidPassword(password);
    if (!isValid) return done(null, false, { message: 'Incorrect password' });
    
    // Add role to user object
    user.role = role;
    return done(null, user, { message: `Logged in successfully as ${role}` });
  } catch (error) {
    return done(error);
  }
}));


passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    switch(obj.role) {
      case 'doctor':
        user = await Doctor.findById(obj.id);
        break;
      case 'patient':
        user = await Patient.findById(obj.id);
        break;
      case 'ngo':
        user = await NGO.findById(obj.id);
        break;
      default:
        return done(new Error('Invalid role'));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});




app.use("/api/auth",authRoutes);



export default app;