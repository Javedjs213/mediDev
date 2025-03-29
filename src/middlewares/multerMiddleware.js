import multer from "multer";
import path from "path";
import crypto from "crypto";
import { __dirname } from "../utils/pathUtils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/upload/images"));
    },

    filename: function (req, file, cb) {
      crypto.randomBytes(12, (error, name)=>{
        const fileName = name.toString("hex") + path.extname(file.originalname);
        cb(null, fileName);
      });
    }
  });
  
  const uploadFile = multer({ storage: storage });

  export default uploadFile;
