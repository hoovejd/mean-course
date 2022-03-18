import { Component, Input, OnInit } from '@angular/core';
import { UserPost } from 'src/app/constants/UserPost';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  @Input() posts: UserPost[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
