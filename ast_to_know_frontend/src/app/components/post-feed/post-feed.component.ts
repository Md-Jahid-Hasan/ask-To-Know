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
import {Post} from "../../services/Post";
import {getTimeDifference} from "../common/time"
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";


@Component({
    selector: 'app-post-feed',
    standalone: true,
    imports: [
        NzCardComponent, NzColDirective, NzRowDirective, NzButtonComponent, NzFlexDirective, NzIconDirective,
        NzCollapseComponent, NzCollapsePanelComponent, NzRadioGroupComponent, NzRadioComponent, NgForOf,
        NzCommentComponent, NzCommentActionComponent, NzTooltipDirective, NzAvatarComponent,
        NzCommentAvatarDirective, NzCommentContentDirective, NzSkeletonComponent, NgIf
    ],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.css'
})
export class PostFeedComponent implements OnInit{
    is_visible_vote: boolean = false
    is_visible_comments: boolean|number = false
    all_post: Post[] = []
    all_comments: any = {}

    constructor(private post_service: PostFeedService) {}

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.post_service.getPostFeed().subscribe(posts => {
                this.all_post = posts.results
            })
        }
    }

    toggleVoteView() {
        this.is_visible_vote = !this.is_visible_vote
    }

    toggleCommentView(post_id:number){
       this.is_visible_comments = post_id == this.is_visible_comments ? false : post_id
        if (!(post_id in this.all_comments)) this.getComments(post_id)
    }

    getComments(post_id: number) {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.post_service.getCommentsOfPost(post_id).subscribe(comments => {
                this.all_comments[post_id] = comments.results
            })
        }
    }

    protected readonly getTimeDifference = getTimeDifference;
}
