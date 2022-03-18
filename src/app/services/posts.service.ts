import { Injectable } from '@angular/core';
import { Post } from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  constructor() { }

  getPosts(): Post[] {
    return [...this.posts]; // copy all items from this.posts array and put them in a new array
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
  }
}
