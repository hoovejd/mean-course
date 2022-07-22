import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const POSTS_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; postsCount: number }>(`${POSTS_URL}${queryParams}`)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            postsCount: postData.postsCount
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postsCount: transformedPostsData.postsCount });
      });
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string }>(`${POSTS_URL}/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //FormData is a javascript object that allows us to send text and files(images) together
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string; post: Post }>(POSTS_URL, postData).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  // image: File | string  means it can either be of type File or string
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http.put(`${POSTS_URL}/${id}`, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(`${POSTS_URL}/${postId}`);
  }
}
