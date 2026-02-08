export type UserRole = 'student' | 'Topiccreator' | 'guest' | 'admin'
export interface User {
    id: number
    username: string
    profilePicUrl: string
    role: UserRole
    email?: string;
    password?: string;
}
export interface Post {
    id: number
    title: string
    author: User
    content: string[]
    comments: ForumComment[]
    createdAt: string
}
export interface ForumComment {
    id: number
    postid: Post['id']
    author: User
    text: string
    createdAt: string
    replies: ForumComment[]
}
export const CURRENT_USER: User = {
    id: 12,
    username: 'Ariflame',
    role: 'admin',
    profilePicUrl: ''
}