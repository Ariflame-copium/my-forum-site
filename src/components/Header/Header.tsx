import type { User } from "../types";
import * as S from '../styled'
import React from "react";
import { Link } from "react-router-dom";
interface HeaderProp {
    user: User
    onMenuClick: () => void
    onLoginCheck: () => void
    onRegisterCheck: () => void
    userAuth: User | null
}
export const Header: React.FC<HeaderProp> = ({ user, onMenuClick, onLoginCheck, onRegisterCheck, userAuth }) => {
    return (
        <S.HeaderWrapper>
            <S.LeftSection>
                <S.MenuButton onClick={onMenuClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                </S.MenuButton>
                <S.Logo>Шкільний Форум</S.Logo>
            </S.LeftSection>
            <S.RightSection>
                {user.role === 'guest' ? (
                    <S.AuthButtons>
                        <S.Button variant="ghost" onClick={onLoginCheck}>Увійти</S.Button>
                        <S.Button variant="primary" onClick={onRegisterCheck}>Реєстрація</S.Button>
                    </S.AuthButtons>
                ) : (
                    <Link to={userAuth ? `/profile/${userAuth.id}` : '#'}>
                        Привіт, {userAuth?.username || 'Гість'}
                    </Link>
                )}
                <S.UserProfile>
                    <S.Avatar
                        src={user.profilePicUrl || 'https://www.computerhope.com/jargon/g/guest-user.png'}
                        alt="avatar"
                    />
                </S.UserProfile>
            </S.RightSection>
        </S.HeaderWrapper>
    )
}