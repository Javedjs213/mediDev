// import Post from "../models/postModel.js"; // Ensure this is the correct path
import Post from "../models/listModel.js";
import { Patient } from "../models/authModel.js";



export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, reportUrl, medicalHistory } = req.body;
    const patientId = req.user.id; // Assuming `req.user` is set by authentication middleware

    if (!content || !medicalHistory) {
      return res.status(400).json({ message: "Content and Medical History are required." });
    }

    const newPost = new Post({
      content,
      imageUrl,
      reportUrl,
      medicalHistory,
      patientId,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("patientId", "fullName email").populate("verifiedBy", "fullName");
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Get Posts by a Specific Patient
export const getPatientPosts = async (req, res) => {
  try {
    const { patientId } = req.params;
    const posts = await Post.find({ patientId }).populate("verifiedBy", "fullName");

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this patient." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching patient posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Verify a Post (Only by NGO)
export const verifyPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const ngoId = req.user.id; // Assuming `req.user` is set via authentication middleware

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.verifiedBy.includes(ngoId)) {
      return res.status(400).json({ message: "Post already verified by this NGO." });
    }

    post.verifiedBy.push(ngoId);
    post.verified = true; // Mark post as verified

    await post.save();
    res.status(200).json({ message: "Post verified successfully", post });
  } catch (error) {
    console.error("Error verifying post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a Post (Only by the Patient)
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const patientId = req.user.id; // Ensure the logged-in user is the owner

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.patientId.toString() !== patientId) {
      return res.status(403).json({ message: "Unauthorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
