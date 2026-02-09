import type React from 'react'
import * as S from './styled'
import type { User } from './types';
import { NavLink } from 'react-router-dom';
interface SiderProp {
    isOpen: boolean;
    onClose: () => void;
    onThemeToggle: () => void;
    currentTheme: 'light' | 'dark'
    user: User
    onAuthClick: () => void
    userAuth: User | null
}
export const Sider: React.FC<SiderProp> = ({ isOpen, onClose, onThemeToggle, currentTheme, onAuthClick, user, userAuth }) => {
    return (
        <>

            <S.SidebarContainer $isOpen={isOpen}>
                <S.SidebarHeader>
                    <h3>{user.role === 'guest' ? 'Навігація' : `Привіт, ${user.username}`}</h3>
                    <S.CloseButton onClick={onClose}>×</S.CloseButton>
                </S.SidebarHeader>
                <S.MenuContent>
                    <S.MenuItem onClick={onThemeToggle}>
                        {currentTheme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
                    </S.MenuItem>
                    <S.MenuItem as={NavLink} to='/'>Головна</S.MenuItem>
                    {user.role === 'guest' ? (
                        <S.MenuItem onClick={onAuthClick}>
                            Увійти
                        </S.MenuItem>
                    ) : (
                        <>
                            <S.MenuItem
                                as={NavLink} to={userAuth ? `/profile/${userAuth?.id}` : '#'}
                                onClick={onClose}
                            >
                                👤 Мій профіль
                            </S.MenuItem>
                            <S.MenuItem as={NavLink} to='/messages' onClick={onClose}>Повідомлення</S.MenuItem>
                            <S.MenuItem onClick={() => {
                                localStorage.removeItem('current_session');
                                window.location.reload();
                            }}>
                                Вийти
                            </S.MenuItem>
                        </>
                    )}
                </S.MenuContent>

                <S.Footer>
                    <S.SocialLink href='https://t.me/ariflame_killaz' target='blank'>Contact with dev</S.SocialLink>
                </S.Footer>
            </S.SidebarContainer>
            <S.Overlay $isOpen={isOpen} onClick={onClose} />
        </>
    )
}