import { Component } from '@angular/core';
import { UserPost } from 'src/app/constants/UserPost';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts: UserPost[] = [];

  onPostAdded(post: UserPost) {
    this.storedPosts.push(post);
  }
}
