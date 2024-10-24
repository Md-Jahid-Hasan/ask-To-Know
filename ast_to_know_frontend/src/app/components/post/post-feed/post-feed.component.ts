import {Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzCollapseComponent, NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {NzCommentActionComponent, NzCommentAvatarDirective, NzCommentComponent} from "ng-zorro-antd/comment";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCommentContentDirective} from "ng-zorro-antd/comment";

import {PostFeedService} from "../../../services/post-feed.service";
import {Post, Comment} from "../../../services/Post";
import {getTimeDifference} from "../../common/time"
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {FormsModule} from "@angular/forms";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzMessageService} from "ng-zorro-antd/message";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {UserHomeComponent} from "../../user-home/user-home.component";
import {CommentComponent} from "../comment/comment.component";
import {NzTagComponent} from "ng-zorro-antd/tag";


@Component({
    selector: 'app-post-feed',
    standalone: true,
    imports: [
        NzCardComponent, NzColDirective, NzRowDirective, NzButtonComponent, NzFlexDirective, NzIconDirective,
        NzCollapseComponent, NzCollapsePanelComponent, NzRadioGroupComponent, NzRadioComponent, NgForOf,
        NzCommentComponent, NzCommentActionComponent, NzTooltipDirective, NzAvatarComponent,
        NzCommentAvatarDirective, NzCommentContentDirective, NzSkeletonComponent, NgIf, FormsModule,
        NzDropDownDirective, NzDropdownMenuComponent, NzMenuDirective, NzMenuItemComponent, InfiniteScrollModule,
        NzDrawerModule, UserHomeComponent, CommentComponent, NgOptimizedImage, NzTagComponent
    ],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.css',
    host: {ngSkipHydration: 'true'}
})
export class PostFeedComponent implements OnInit {
    @ViewChild('comment_input') comment_input!: ElementRef;

    is_visible_vote: boolean | number = false
    is_visible_comments: boolean | number = false
    all_post: Post[] = []
    new_post: string = ""
    post_page_number: number = 1

    all_comments: any = {}
    new_comment: string = ""
    comment_reply: number = 0
    comment_reply_mention: string = ""
    comment_page_number: number = 1

    rating: string = ""
    is_loading: boolean = false
    user_questions_visible: boolean = false
    drawerWidth:string = "50%"

    constructor(private post_service: PostFeedService, private messageService: NzMessageService) {}

    ngOnInit() {
        this.adjustDrawerWidth()
        this.post_service.user_question_visibility.subscribe(
            data => this.user_questions_visible = data)
        if (typeof window !== 'undefined' && window.localStorage) {
            this.getPosts()
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.adjustDrawerWidth();
    }

    adjustDrawerWidth(): void {
        if (window.matchMedia('(max-width: 768px)').matches) {
          this.drawerWidth = '100%';
        } else if (window.matchMedia('(max-width: 1000px)').matches){
            this.drawerWidth = '75%';
        } else {
          this.drawerWidth = '50%';
        }
  }

    onScroll() {
        if (this.post_page_number !== 0) {
            this.post_page_number += 1
            this.getPosts()
        }
    }

    onCommentScroll() {
        if (this.comment_page_number !== 0){
            this.comment_page_number+=1
            if (typeof this.is_visible_comments == "number")
                this.getComments(this.is_visible_comments)
        }
    }

    toggleVoteView(post_id: number) {
        this.is_visible_vote = post_id == this.is_visible_vote ? false : post_id
    }

    toggleCommentView(post_id: number) {
        this.is_visible_comments = post_id == this.is_visible_comments ? false : post_id
        this.comment_page_number = 1
        if (!(post_id in this.all_comments)) this.getComments(post_id)
        this.new_comment = ""

        this.comment_reply = 0
        this.comment_reply_mention = ""
    }

    getPosts() {
        if (this.post_page_number !== 0)
            this.is_loading = true
        this.post_service.getPostFeed(this.post_page_number).subscribe(posts => {
            this.all_post = this.all_post.concat(posts.results)
            if (posts.next === null) this.post_page_number = 0
            this.is_loading = false
        }, error => {
            this.is_loading = false
        })
    }

    createNewPost() {
        this.post_service.createPost({content: this.new_post}).subscribe(post => {
                this.all_post.unshift(post)
                this.new_post = ""
                this.messageService.success("Successfully Posted")
            },
            error => {
                let error_message = error.error
                for (const key in error_message) {
                    this.messageService.error(`${key}: ${error_message[key][0]}`)
                }
            })
    }

    getComments(post_id: number) {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.post_service.getCommentsOfPost(post_id, this.comment_page_number).subscribe(comments => {
                let post_comments = this.all_comments[post_id] || []
                if (post_id in this.all_comments)
                    this.all_comments[post_id] = post_comments.concat(comments.results)
                else this.all_comments[post_id] = comments.results

                if (comments.next === null) this.comment_page_number = 0
            })
        }
    }

    createComments(post_id: number) {
        if (typeof window !== 'undefined' && window.localStorage) {
            let comment:{content: string, reply_to?: number} = {content:"", reply_to:0}
            if (this.comment_reply !== 0){comment = {content: this.new_comment, reply_to: this.comment_reply}}
            else {comment = {content: this.new_comment}}

            this.post_service.createComment(post_id, comment).subscribe(comment => {
                let prev_comments = this.all_comments[post_id] || []

                if (this.comment_reply === 0) prev_comments.unshift(comment)
                else prev_comments.filter((com: any) => com.id===this.comment_reply)[0]['replies'].unshift(comment)

                this.all_comments[post_id] = prev_comments
                this.new_comment = ""
                this.updateTotalComments({func: (x: number) => x + 1, post_id: post_id})
            })
        }
    }

    disableReply(e: Event){
        this.comment_reply = 0
    }

    replyComment(kwargs: {comment_id: number, name: string}){
        this.comment_reply = kwargs.comment_id
        this.comment_reply_mention = kwargs.name
        this.comment_input.nativeElement.focus()
    }

    giveVote(post_id: number) {
        this.post_service.votePost(post_id, {rating: this.rating}).subscribe(res => {
            if (res.result == true) {
                this.messageService.success("Your vote is recorded")
                this.all_post = this.all_post.map(post => post.id == post_id ?
                    {...post, is_voted: true, average_votes: res.average} : post)
                this.is_visible_vote = false
            }
        })
    }

    removeComment(kwargs: { comment_id: number, comment: any }) {
        let post_id: any = this.is_visible_comments
        let comments: Comment[] = this.all_comments[post_id] || []
        comments = comments.map(comm => comm.id === kwargs.comment_id ? kwargs.comment : comm)
            .filter(com => Object.keys(com).length !== 0)
        this.all_comments[post_id] = comments
    }

    updateTotalComments(kwargs: { func: any, post_id: number }) {
        this.all_post = this.all_post.map(post => post.id === kwargs.post_id ?
            {...post, total_comments: kwargs.func(post.total_comments)} : post)
    }

    closeUserQuestions() {
        this.post_service.user_question_visibility.next(false)
    }

    userQuestionsVisibilityChange() {
        if (this.user_questions_visible) {
            console.log("user question task todo")
        }
    }

    protected readonly getTimeDifference = getTimeDifference;
}
