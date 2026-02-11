import React, { useState, useEffect } from "react";
import * as S from './styled'
import type { User } from "./types";
interface ModalProp {
    isOpen: boolean
    onClose: () => void
    OnAuthSuccess: (user: User) => void
    initialMode: 'login' | 'register'
}
export const Modal: React.FC<ModalProp> = ({ isOpen, onClose, OnAuthSuccess, initialMode }) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        pass: '',
        username: ''
    });

    useEffect(() => {
        if (isOpen) setIsLoginMode(initialMode === 'login');
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setFormData({ email: '', pass: '', username: '' });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        const payload = isLoginMode
            ? { email: formData.email, password: formData.pass }
            : {
                username: formData.username,
                email: formData.email,
                password: formData.pass,
                role: 'student',
                profilePicUrl: ''
            };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Помилка доступу');

            if (isLoginMode) {
                OnAuthSuccess(data);
                handleClose();
            } else {
                alert('Реєстрація успішна! Увійдіть у свій акаунт.');
                setIsLoginMode(true);
            }
        } catch (err: any) {
            alert(err.message || 'Сталася помилка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Overlay $isOpen={isOpen} onClick={handleClose}>
            <S.ModalBox onClick={(e) => e.stopPropagation()}>
                <S.CloseModal onClick={handleClose} />
                <S.ModalTitle>{isLoginMode ? 'Вхід' : 'Реєстрація'}</S.ModalTitle>

                <S.AuthForm onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <S.AuthInput
                            name="username"
                            type="text"
                            placeholder="Ім'я користувача"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    <S.AuthInput
                        name="email"
                        type="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <S.AuthInput
                        name="pass"
                        type="password"
                        placeholder="Пароль"
                        value={formData.pass}
                        onChange={handleInputChange}
                        required
                    />
                    <S.AuthButton type="submit" disabled={loading}>
                        {loading ? 'Завантаження...' : (isLoginMode ? 'Увійти' : 'Створити акаунт')}
                    </S.AuthButton>
                </S.AuthForm>

                <S.SwitchText onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? "Ще не маєте акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
                </S.SwitchText>
            </S.ModalBox>
        </S.Overlay>
    );
};