import { usePosts } from './usePosts';
import type { User } from '../types';
import type { CreatePostPayload } from './usePosts';
import { useState, useEffect, useCallback, useMemo } from 'react';

export const useAppLogic = () => {
    const [visible, setVisible] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [userAuth, setUserauth] = useState<User | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
    const { posts, addPost: originalAddPost, addComment, allComment, deleteComment, deleteReply } = usePosts();

    const toggleSider = useCallback(() => setVisible(prev => !prev), []);

    const openLogin = useCallback(() => {
        setModalMode('login');
        setAuthModalOpen(true);
    }, []);

    const openRegister = useCallback(() => {
        setModalMode('register');
        setAuthModalOpen(true);
    }, []);

    const handleAuth = useCallback((user: User) => {
        setUserauth(user);
        setVisible(false);
        localStorage.setItem('current_session', JSON.stringify(user));
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);


    const protectedPost = useCallback((newPost: CreatePostPayload) => {
        if (!userAuth || userAuth.role === 'guest' || !userAuth.id) {
            openLogin();
            return;
        }
        originalAddPost(newPost);
    }, [userAuth, openLogin, originalAddPost]);

    useEffect(() => {
        try {
            const savedSession = localStorage.getItem('current_session');
            if (savedSession) {
                const parsedUser = JSON.parse(savedSession);
                if (parsedUser.id && String(parsedUser.id).length < 10 && parsedUser.id !== 0) {
                    localStorage.removeItem('current_session');
                    return;
                }
                setUserauth(parsedUser);
            }
        } catch (err) {
            console.error("Помилка відновлення сесії:", err);
            localStorage.removeItem('current_session');
        }
    }, []);

    const currentUser: User = useMemo(() => userAuth || {
        username: 'Гість',
        id: 0,
        role: 'guest',
        profilePicUrl: ''
    }, [userAuth]);

    return useMemo(() => ({
        state: { visible, isAuthModalOpen, userAuth, theme, modalMode, posts },
        actions: {
            setVisible,
            setAuthModalOpen,
            toggleSider,
            openLogin,
            openRegister,
            handleAuth,
            toggleTheme,
            addPost: protectedPost,
            addComment,
            allComment,
            deleteComment,
            deleteReply
        },
        currentUser
    }), [visible, isAuthModalOpen, userAuth, theme, modalMode, posts, protectedPost, currentUser, addComment, allComment, deleteComment, deleteReply]);
};