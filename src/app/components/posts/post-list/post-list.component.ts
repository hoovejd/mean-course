import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 25];
  userId: string;
  private postsSubscription: Subscription = new Subscription();
  private authStatusSubscription: Subscription;
  public userIsAuthenticated: boolean = false;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    // subscribe to the postsUpdated Subject in the PostService. Anytime there is an update to the posts in PostService, update our local post array
    this.postsSubscription = this.postsService.getPostsUpdatedListener().subscribe({
      next: (postData: { posts: Post[]; postsCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postsCount;
      }
    });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe({
      next: (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe({
      next: () => this.postsService.getPosts(this.postsPerPage, this.currentPage),
      error: () => (this.isLoading = false)
    });
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
