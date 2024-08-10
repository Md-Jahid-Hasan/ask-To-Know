export interface Post {
    id: number,
    content: string,
    created_at: string,
    average_votes: number,
    total_comments: number,
    user: {name: string},
    is_voted: boolean
}

export interface Comment {
    id: number,
    comment_at: string,
    content: string,
    is_owner: boolean,
    user: {name: string}
}
