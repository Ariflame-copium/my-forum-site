import { useState, useEffect } from "react";
import type { Post, User } from "../types";
import type { ForumComment } from "../types";
import { useAppLogic } from "./useAppLogic";
export type CreatePostPayload = Omit<Post, 'id' | 'author' | 'comments' | 'createdAt'> & {
    title: string;
    content: string[];
    authorId: number;
    author: User;
};
export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAppLogic()
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    useEffect(() => {
        fetch(`${API_URL}/api/posts`)
            .then(res => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("Отримано не масив:", data);
                    setPosts([]);
                }
            })
            .catch(err => {
                console.error("Помилка загрузки:", err);
                setPosts([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const addPost = async (payload: CreatePostPayload) => {
        try {
            const response = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const savedPostFromServer = await response.json();


            const postForUI: Post = {
                ...savedPostFromServer,
                author: currentUser
            };

            setPosts(prev => [postForUI, ...prev]);

        } catch (err) {
            console.error("Помилка:", err);
        }
    };

    const allComment = posts.flatMap(p => p.comments || []);
    const deleteReply = async (postId: number, commentId: number) => {
        const response = await fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setPosts(prevPosts => prevPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(c => c.id !== commentId)
                    };
                }
                return post;
            }));
        }
    };
    const deleteComment = async (postId: number) => {
        try {
            const response = await fetch(`${API_URL}/api/posts/${postId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setPosts(prev => prev.filter(post => post.id !== postId))
            }
        }
        catch (err) {
            console.log('Помилка при видаленні', err)
        }
    }
    const addComment = async (postId: number, comment: Omit<ForumComment, 'id' | 'createdAt'>) => {
        try {
            const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            });
            const savedComment = await response.json();
            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? { ...post, comments: [...(post.comments || []), savedComment] }
                    : post
            ));
        } catch (err) {
            console.error("Помилка при спробі додати коментар:", err);
        }
    };

    return { posts, addPost, addComment, isLoading, allComment, deleteComment, deleteReply, setPosts };
};