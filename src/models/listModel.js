import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {

    content: {
      type: String,
    },
    imageUrl: {
      type: [String], // Array of image URLs
      default: [],
    },
    reportUrl: {
      type: [String], // Array of report URLs
      default: [],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    verifiedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null, // Optional, as NGO verification is not always required
    }],
    verified: {
      type: Boolean,
      default: false, // Default: not verified
    },
    medicalHistory: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
