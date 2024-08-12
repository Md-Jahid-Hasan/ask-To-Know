import {Component, OnInit} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzCollapseComponent, NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NgForOf, NgIf} from "@angular/common";
import {NzCommentActionComponent, NzCommentAvatarDirective, NzCommentComponent} from "ng-zorro-antd/comment";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCommentContentDirective} from "ng-zorro-antd/comment";

import {PostFeedService} from "../../services/post-feed.service";
import {Post, Comment} from "../../services/Post";
import {getTimeDifference} from "../common/time"
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {FormsModule} from "@angular/forms";
import {NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzMessageService} from "ng-zorro-antd/message";
import {InfiniteScrollModule} from "ngx-infinite-scroll";


@Component({
    selector: 'app-post-feed',
    standalone: true,
    imports: [
        NzCardComponent, NzColDirective, NzRowDirective, NzButtonComponent, NzFlexDirective, NzIconDirective,
        NzCollapseComponent, NzCollapsePanelComponent, NzRadioGroupComponent, NzRadioComponent, NgForOf,
        NzCommentComponent, NzCommentActionComponent, NzTooltipDirective, NzAvatarComponent,
        NzCommentAvatarDirective, NzCommentContentDirective, NzSkeletonComponent, NgIf, FormsModule, NzDropDownDirective, NzDropdownMenuComponent, NzMenuDirective, NzMenuItemComponent, InfiniteScrollModule
    ],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.css'
})
export class PostFeedComponent implements OnInit {
    is_visible_vote: boolean | number = false
    is_visible_comments: boolean | number = false
    all_post: Post[] = []
    all_comments: any = {}
    new_post: string = ""
    new_comment: string = ""
    rating: string = ""
    post_page_number: number = 1

    constructor(private post_service: PostFeedService, private messageService: NzMessageService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.getPosts()
        }
    }

    onScroll() {
        console.log("scrolled!!");
        if (this.post_page_number !== 0) {
            this.post_page_number += 1
            this.getPosts()
        }
    }

    toggleVoteView(post_id: number) {
        this.is_visible_vote = post_id == this.is_visible_vote ? false : post_id
    }

    toggleCommentView(post_id: number) {
        this.is_visible_comments = post_id == this.is_visible_comments ? false : post_id
        if (!(post_id in this.all_comments)) this.getComments(post_id)
        this.new_comment = ""

    }

    getPosts() {
        if (this.post_page_number!==0)
            this.post_service.getPostFeed(this.post_page_number).subscribe(posts => {
                this.all_post = this.all_post.concat(posts.results)
                if (posts.next===null) this.post_page_number = 0
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
            this.post_service.getCommentsOfPost(post_id).subscribe(comments => {
                this.all_comments[post_id] = comments.results
            })
        }
    }

    createComments(post_id: number) {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.post_service.createComment(post_id, {content: this.new_comment}).subscribe(comment => {
                let prev_comments = this.all_comments[post_id] || []
                prev_comments.unshift(comment)
                this.all_comments[post_id] = prev_comments
                this.new_comment = ""

                this.all_post = this.all_post.map(post => post.id === post_id ?
                    {...post, total_comments: post.total_comments + 1} : post)
            })
        }
    }

    giveVote(post_id: number) {
        this.post_service.votePost(post_id, {rating: this.rating}).subscribe(res => {
            if (res.result == true) {
                this.all_post = this.all_post.map(post => post.id == post_id ?
                    {...post, is_voted: true, average_votes: res.average} : post)
                this.is_visible_vote = false
            }
        })
    }

    deleteComment(comment_id: number, post_id: number) {
        this.post_service.deleteComment(comment_id).subscribe(res => {
            let comments: Comment[] = this.all_comments[post_id] || []
            comments = comments.filter(comm => comm.id !== comment_id)
            this.all_comments[post_id] = comments

            this.all_post = this.all_post.map(post => post.id === post_id ?
                {...post, total_comments: post.total_comments - 1} : post)
            this.messageService.success("successfully deleted your comment")
        })
    }

    protected readonly getTimeDifference = getTimeDifference;
}
