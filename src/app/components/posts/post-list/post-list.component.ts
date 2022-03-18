import { Component, OnInit } from '@angular/core';

type UserPost = {
  title: string;
  content: string;
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  // posts: UserPost[] = [
  //   { title: 'First Post', content: 'This is the first posts content' },
  //   { title: 'Second Post', content: 'This is the second posts content' },
  //   { title: 'Third Post', content: 'This is the third posts content' }
  // ]
  posts: UserPost[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
