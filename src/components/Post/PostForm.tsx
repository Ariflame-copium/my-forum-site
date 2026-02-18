import React, { useState } from "react";
import type { User } from "../types";
import { Modal } from "../Modal";
import type { CreatePostPayload } from "../hooks/usePosts";
import * as S from '../styled'
interface PostFormProps {
    onAddPost: (newPost: CreatePostPayload) => void;
    currentUser: User;
    OnAuthSuccess: (user: User) => void;
}

export const PostForm: React.FC<PostFormProps> = ({ onAddPost, currentUser, OnAuthSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const allowedRoles = ['student', 'admin', 'topicCreator']
    const canpost = currentUser && allowedRoles.includes(currentUser.role)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanTitle = title.trim()
        const cleanContent = content.trim()
        if (!cleanTitle || !cleanContent) {
            alert('Заголовок та контент мають бути заповнені!')
            return
        }

        const payload = {
            title: title,
            content: content.split('\n').filter((p: string) => p.trim() !== ''),
            authorId: currentUser.id // Передаємо тільки ID, як того чекає сервер
        };

        onAddPost(payload);
        setTitle('');
        setContent('');
    };

    return (
        <>
            {canpost ? (
                <S.FormWrapper onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Заголовок посту"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Що у вас нового?"
                    />
                    <button type="submit">Опубликовать</button>
                </S.FormWrapper>
            ) : (<S.EmptyState onClick={() => setAuthModalOpen(true)}>
                <p>📝 Бажаєте створити пост? <b>Увійдіть або зареєструйтеся</b></p>
            </S.EmptyState>
            )}
            <Modal isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                OnAuthSuccess={(user) => {
                    OnAuthSuccess(user);
                    setAuthModalOpen(false);
                }}
                initialMode="login"
            />
        </>
    );
};