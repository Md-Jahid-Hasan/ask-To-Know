export interface Question {
    id: number,
    question: string,
    answer: null | string,
    user: number,
    assignee: number,
    category: Category|number
}

interface Category {
    id:number,
    name:string
}
