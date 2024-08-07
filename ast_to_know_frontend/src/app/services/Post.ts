export interface Post {
    id: number,
    content: string,
    created_at: string,
    average_votes: number,
    total_comments: number,
    user: {name: string}
}
