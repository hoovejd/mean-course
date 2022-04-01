import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSubscription: Subscription = new Subscription();

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();

    // subscribe to the postsUpdated Subject in the PostService. Anytime there is an update to the posts in PostService, update our local post array
    this.postsSubscription = this.postsService.getPostsUpdatedListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }
}
