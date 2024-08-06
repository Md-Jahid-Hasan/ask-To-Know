import {Component} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzCollapseComponent, NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {NgForOf} from "@angular/common";
import {NzCommentActionComponent, NzCommentAvatarDirective, NzCommentComponent} from "ng-zorro-antd/comment";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzCommentContentDirective} from "ng-zorro-antd/comment";


@Component({
    selector: 'app-post-feed',
    standalone: true,
    imports: [
        NzCardComponent,
        NzColDirective,
        NzRowDirective,
        NzButtonComponent,
        NzFlexDirective,
        NzIconDirective,
        NzCollapseComponent,
        NzCollapsePanelComponent,
        NzRadioGroupComponent,
        NzRadioComponent,
        NgForOf,
        NzCommentComponent,
        NzCommentActionComponent,
        NzTooltipDirective,
        NzAvatarComponent,
        NzCommentAvatarDirective,
        NzCommentContentDirective
    ],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.css'
})
export class PostFeedComponent {
    is_visible_vote: boolean = false
    is_visible_comments: boolean = false
    toggleVoteView() {
        this.is_visible_vote = !this.is_visible_vote
    }

    toggleCommentView(){
       this.is_visible_comments = !this.is_visible_comments
    }
}
