import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<Post>(); // output make it so the parent can listen for the emitted event

  onAddPost(form: NgForm): void {
    if (form.invalid) return;
    const post: Post = { title: form.value.title, content: form.value.content };
    this.postCreated.emit(post);
  }

}
