import { Injectable } from '@angular/core';
import { Post } from "../models/post.model";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() { }

  getPosts(): Post[] {
    return [...this.posts]; // copy all items from this.posts array and put them in a new array
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); // If posts array changes, send any listeners a copy of the updated posts array!
  }
}
