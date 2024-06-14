interface Category {
    id: number,
    name: string
}

interface User {
    name: string
}


export interface Question {
    id: number,
    question: string,
    question_attachments?: Question_Attachments[],
    answer: null | string,
    user?: User,
    assignee?: number,
    category: Category
    created_at: string,
    answered_at: string
}

interface Question_Attachments {
    attachment: string,
    name: string
}
