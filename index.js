import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

import Blog from './models/blog.js'; 

const app = express();
const port = 4000;

mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => { console.log("Connected to MongoDB") })
.catch((err) => { console.log(err) });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CHALLENGE 1: GET All posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Blog.find(); // Fetch all posts from MongoDB
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id); // Find post by ID in MongoDB
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHALLENGE 3: POST a new post
app.post("/posts", async (req, res) => {
  const newPost = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  });
  try {
    const savedPost = await newPost.save(); // Save new post to MongoDB
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async (req, res) => {
  try {
    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update specified fields
      { new: true } // Return the updated document
    );
    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHALLENGE 5: DELETE a specific post by providing the post id
app.delete("/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id); // Delete post by ID
    if (deletedPost) {
      res.json({ message: "Post deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
