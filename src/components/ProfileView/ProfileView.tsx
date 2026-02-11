import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppLogic } from '../hooks/useAppLogic';
import styled from 'styled-components';
import type { User } from '../types';
type ProfileViewProps = User & {
    stats: {
        posts: number;
        comments: number;
    };
};

export const ProfileView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { currentUser } = useAppLogic();
    const [userData, setUserData] = useState<ProfileViewProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        fetch(`${API_URL}/api/users/${userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Користувача не знайдено або помилка сервера');
                }
                return res.json();
            })
            .then(data => {
                setUserData(data);
            })
            .catch(err => {
                console.error('Помилка профілю:', err);
                setUserData(null);
            })
            .finally(() => setLoading(false));
    }, [userId]);
    const compressImage = (base64Str: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_WIDTH) {
                        width *= MAX_WIDTH / height;
                        height = MAX_WIDTH;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const compressed = await compressImage(base64);
                setEditAvatar(compressed);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSave = async () => {
        const payload = {
            username: editName.trim() || userData?.username,
            profilePicUrl: editAvatar || userData?.profilePicUrl,
            requesterId: currentUser.id
        }
        try {
            const response = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const updated = await response.json();
                setUserData(updated);
                localStorage.setItem('current_session', JSON.stringify(updated));
                setIsEditing(false);
                alert('Профіль оновлено!');
                window.location.reload();
            }
        } catch (err) {
            console.error("Помилка при збереженні:", err);
        }
    };
    const startEditing = () => {
        if (userData) {
            setEditName(userData.username);
            setEditAvatar(userData.profilePicUrl);
            setIsEditing(true);
        }
    };

    if (loading) return <div>Завантаження...</div>;
    if (!userData) return <div>Користувача не знайдено</div>;
    const isMyProfile = String(userId) === String(currentUser?.id);
    return (
        <S.ProfileContainer>
            <S.Avatar
                src={editAvatar || userData.profilePicUrl || 'https://www.computerhope.com/jargon/g/guest-user.png'}
                alt="Профіль"
            />

            <S.Info>
                {!isEditing ? (
                    <h1>{userData.username}</h1>
                ) : (
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ padding: '8px', fontSize: '18px', borderRadius: '4px' }}
                    />
                )}
                <p>Роль: <strong>{userData.role}</strong></p>
                <p>Email: {userData.email || 'не вказано'}</p>
            </S.Info>

            <S.StatsGrid>
                <S.StatCard><h3>Постів: {userData?.stats?.posts}</h3></S.StatCard>
                <S.StatCard><h3>Коментарів: {userData?.stats?.comments}</h3></S.StatCard>
            </S.StatsGrid>
            {isMyProfile && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {!isEditing ? (
                        <button
                            onClick={startEditing}
                            style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '8px' }}
                        >
                            ⚙️ Редагувати профіль
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '10px' }}>Змінити аватар:</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleSave} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                                    Зберегти
                                </button>
                                <button onClick={() => setIsEditing(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </S.ProfileContainer>
    );
};
const S = {
    ProfileContainer: styled.div`
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        text-align: center;
    `,
    Avatar: styled.img`
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 4px solid #4a90e2;
        object-fit: cover;
        margin-bottom: 15px;
    `,
    Info: styled.div`
        margin-bottom: 25px;
        h1 { margin: 0; color: #4a90e2; }
        p { opacity: 0.8; }
    `,
    StatsGrid: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    `,
    StatCard: styled.div`
        background: rgba(74, 144, 226, 0.1);
        padding: 15px;
        border-radius: 10px;
        h3 { margin: 0; font-size: 2rem; color: #4a90e2; }
        span { font-size: 0.9rem; opacity: 0.7; }
    `
};