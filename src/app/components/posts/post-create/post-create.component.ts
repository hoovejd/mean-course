import { Component, EventEmitter, Output } from "@angular/core";
import { UserPost } from 'src/app/constants/UserPost';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent: string = '';
  enteredTitle: string = '';
  @Output() postCreated = new EventEmitter(); // output make it so the parent can listen for the emitted event

  onAddPost(): void {
    const post: UserPost = { title: this.enteredTitle, content: this.enteredContent };
    this.postCreated.emit(post);
  }

}
