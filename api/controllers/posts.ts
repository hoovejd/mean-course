import { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post';

exports.createPost = (req: Request, res: Response, next: NextFunction) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
  });
  post
    .save()
    .then(
      // using the spread operator (...) to copy all properties of createdPost object into new post object
      (createdPost) => res.status(201).json({ message: 'Post added successfully', post: { ...createdPost, id: createdPost._id } })
    )
    .catch((error) => res.status(500).json({ message: 'Creating a post failed!' }));
};

exports.updatePost = (req: Request, res: Response, next: NextFunction) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new PostModel({ _id: req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId });
  PostModel.updateOne({ _id: req.params['id'], creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Couldn't update post!" });
    });
};

exports.getPosts = (req: Request, res: Response, next: NextFunction) => {
  const pageSize: number = +req.query['pageSize']; // The + symbol converts to number
  const currentPage: number = +req.query['page'];
  const postQuery = PostModel.find(); // default to find everything
  let fetchedPosts: any;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((foundPosts) => {
      fetchedPosts = foundPosts;
      return PostModel.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        postsCount: count
      });
    })
    .catch((error) => res.status(500).json({ message: 'Fetching posts failed!' }));
};

exports.getPost = (req: Request, res: Response, next: NextFunction) => {
  PostModel.findById(req.params['id'])
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch((error) => res.status(500).json({ message: 'Fetching post failed!' }));
};

exports.deletePost = (req: Request, res: Response, next: NextFunction) => {
  PostModel.deleteOne({ _id: req.params['id'], creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Post deleted!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch((error) => res.status(500).json({ message: 'Deleting post failed!' }));
};
