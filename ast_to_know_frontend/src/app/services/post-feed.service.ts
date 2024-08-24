import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PostFeedService {
    user_question_visibility = new Subject<boolean>()

    constructor(private http: HttpClient) {}

    getPostFeed(page_number: number): Observable<any>{
        return this.http.get<any>(`api/post/?page=${page_number}`)
    }

    createPost(post: {content: string}):Observable<any>{
        return this.http.post<any>("api/post/", post)
    }

    deletePost(post_id:number): Observable<any>{
        return this.http.delete<any>(`api/post/${post_id}/`)
    }

    getCommentsOfPost(post_id: number): Observable<any>{
        return this.http.get<any>(`api/post/comment/${post_id}/`)
    }

    createComment(post_id: number, comment: {content: string}): Observable<any>{
        return this.http.post<any>(`api/post/comment/${post_id}/`, comment)
    }

    deleteComment(comment_id: number): Observable<any> {
        return this.http.delete<any>(`api/post/comment/${comment_id}/`)
    }

    votePost(post_id: number, rating: {rating: string}): Observable<any> {
        return this.http.post<any>(`api/post/vote/${post_id}/`, rating)
    }
}
