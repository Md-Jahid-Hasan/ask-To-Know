import {Component, EventEmitter, Input, Output} from '@angular/core';
import {getTimeDifference} from "../../common/time";
import {NgForOf, NgIf} from "@angular/common";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
    NzCommentActionComponent,
    NzCommentAvatarDirective,
    NzCommentComponent,
    NzCommentContentDirective
} from "ng-zorro-antd/comment";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {Post} from "../../../services/Post";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {PostFeedService} from "../../../services/post-feed.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [
        NgForOf,
        NzAvatarComponent,
        NzColDirective,
        NzCommentActionComponent,
        NzCommentAvatarDirective,
        NzCommentComponent,
        NzCommentContentDirective,
        NzDropDownDirective,
        NzDropdownMenuComponent,
        NzIconDirective,
        NzMenuDirective,
        NzMenuItemComponent,
        FormsModule,
        NgIf,
        NzButtonComponent,
        NzRowDirective,
        NzSkeletonComponent,
        ReactiveFormsModule
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.css'
})
export class CommentComponent {
    @Input() comment: any = {}
    @Input() post: Post = {
        average_votes: 0,
        content: "",
        created_at: "",
        id: 0,
        is_voted: false,
        total_comments: 0,
        user: {name: ""}
    }
    @Input() is_visible_comments: boolean | number = false

    @Output() updateTotalComments: EventEmitter<any> = new EventEmitter()
    @Output() removeComment: EventEmitter<any> = new EventEmitter()

    constructor(private post_service: PostFeedService, private messageService: NzMessageService) {
    }

    deleteComment(comment_id: number, post_id: number) {
        this.post_service.deleteComment(comment_id).subscribe(res => {
            this.removeCommentContainer({comment_id: comment_id, comment: {}})
            this.updateTotalCommentsContainer({func: (x: number) => x - 1, post_id:post_id})
            this.messageService.success("successfully deleted your comment")
        })
    }

    removeCommentContainer(kwargs:{comment_id:number, comment:any}) {
        if (this.comment.replies.length !== 0) {
            if (this.comment.id === kwargs.comment_id){
                let replies_delete = this.comment.replies.length
                this.updateTotalCommentsContainer({func: (x: number) => x - replies_delete,
                    post_id:this.is_visible_comments as number})
                this.removeComment.emit({comment_id: this.comment.id, comment: {}})
            } else {
                let new_comment = this.comment
                new_comment.replies = this.comment.replies.filter((com: any) => com.id !== kwargs.comment_id)
                this.removeComment.emit({comment_id: this.comment.id, comment: new_comment})
            }
        } else {
            this.removeComment.emit({comment_id: this.comment.id, comment: {}})
        }
    }

    updateTotalCommentsContainer(kwargs:{func:any, post_id: number}) {
        this.updateTotalComments.emit({func: kwargs.func, post_id: kwargs.post_id})
    }

    protected readonly getTimeDifference = getTimeDifference;
}
