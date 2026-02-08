import type { Post } from "./types";
export const MockPost: Post[] = [
    {
        id: 1,
        title: "Тестовий пост для перевірки дерева",
        content: ["Тут ми перевіряємо, як працюють вкладені коментарі."], // Сделали массивом
        author: { id: 99, username: "Admin", role: "Topiccreator", profilePicUrl: '' },
        createdAt: "17.01.2026",
        comments: [
            {
                id: 101,
                postid: 1, // Добавили обязательное поле
                author: { id: 1, username: "Ariflam", role: "student", profilePicUrl: '' },
                text: "Це коментар першого рівня!",
                createdAt: "13:45",
                replies: [
                    {
                        id: 102,
                        postid: 1, // И здесь тоже
                        author: { id: 2, username: "Guest User", role: "guest", profilePicUrl: '' },
                        text: "А це відповідь на коментар (рекурсія в дії)!",
                        createdAt: "13:50",
                        replies: []
                    }
                ]
            }

        ]
    }
] 