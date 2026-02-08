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
    const [login, setLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [username, setUsername] = useState('')
    useEffect(() => {
        if (isOpen) {
            setLogin(initialMode === 'login')
        }
    }, [isOpen, initialMode])
    if (!isOpen) return null
    const handleClose = () => {
        setEmail('')
        setPass('')
        setUsername('')
        onClose()
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const storedUser: User[] = JSON.parse(localStorage.getItem('forum_users') || '[]')
        if (login) {
            const foundUser = storedUser.find((u) => u.email === email && u.password === pass)

            if (foundUser) {
                OnAuthSuccess(foundUser)
                handleClose()
            } else {
                alert('Невірний логін або пароль')
            }
        } else {
            const userExist = storedUser.some((u) => u.email === email)
            if (userExist) {
                alert('Користувач з таким email вже існує')
                return
            }
            const newUser: User = {
                id: Date.now(),
                username: username,
                email: email,
                password: pass,
                role: 'student',
                profilePicUrl: ''
            }
            const updatedUser = [...storedUser, newUser]
            localStorage.setItem('forum_users', JSON.stringify(updatedUser))
            alert('Реєстрація успішна! Тепер увійдіть.')
            setLogin(true)
        }
    }
    return (
        <S.Overlay $isOpen={isOpen} onClick={handleClose}>
            <S.ModalBox onClick={(e) => e.stopPropagation()}>
                <S.CloseModal onClick={handleClose}></S.CloseModal>
                <S.ModalTitle>
                    {login ? 'Вхід' : 'Реєстрація'}
                </S.ModalTitle>
                <S.AuthForm onSubmit={handleSubmit}>
                    {!login && (
                        <S.AuthInput
                            type="text"
                            placeholder="Ім'я користувача"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required></S.AuthInput>
                    )}
                    <S.AuthInput
                        type="email"
                        placeholder="Електронна пошта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required></S.AuthInput>
                    <S.AuthInput
                        type="password"
                        placeholder="Пароль"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required></S.AuthInput>
                    <S.AuthButton type="submit">
                        {!login ? 'Створити акаунт' : "Увійти"}
                    </S.AuthButton>
                </S.AuthForm>
                <S.SwitchText onClick={() => setLogin(!login)} style={{ cursor: 'pointer', marginTop: '1rem' }}>
                    {login ? (
                        <>Ще не маєте акаунту? <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>Зареєструватися</span></>
                    ) : (
                        <>Вже є акаунт? <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>Увійти</span></>
                    )}
                </S.SwitchText>
            </S.ModalBox>
        </S.Overlay>
    )
}