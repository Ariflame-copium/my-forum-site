import styled, { createGlobalStyle } from "styled-components";
import type { ThemeType } from "./theme";
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType { }
}
export const GlobalStyle = createGlobalStyle`
 body {
    /* Цвет фона теперь зависит от выбранной темы */
    background-color: ${props => props.theme.body}; 
    color: ${props => props.theme.text};
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease; /* Плавный переход */
  }

  .container {
    max-width: 900px;
    margin: 80px auto 0;
    padding: 20px;
  }
`;

/* --- Header --- */
export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 64px;
  background: #000000;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background-color: ${props => props.theme.headerBg}; 
  border-bottom: 1px solid ${props => props.theme.border};
  box-sizing: border-box;
`;

export const LeftSection = styled.div`display: flex; align-items: center; gap: 15px;`;
export const RightSection = styled.div`display: flex; align-items: center; gap: 15px;`;
export const Logo = styled.h1`font-size: 1.25rem; color: #007bff; margin: 0;`;

export const MenuButton = styled.button`
  background: none; border: none; cursor: pointer;
  span { display: block; width: 20px; height: 2px; background: #333; background-color: ${props => props.theme.text}; 
    margin: 4px 0;
    border-radius: 2px;}
`;
export const AuthButtons = styled.div`
  display: flex;
  gap: 12px;
`;

/* --- Карточки (Посты) --- */
export const ListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Card = styled.article`
  background-color: ${props => props.theme.cardBg}; /* Серая карточка из темы */
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  text-align: left;
  transition: background-color 0.3s ease;

  hr {
    border: 0;
    border-top: 1px solid ${props => props.theme.border};
    margin: 20px 0;
  }
`;

export const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.6rem;
  color: ${props => props.theme.text}; /* Инверсия цвета */
`;
export const Content = styled.div`
  color: ${props => props.theme.text};
  line-height: 1.6;

  p {
    margin: 10px 0;
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
  opacity: 0.8;

  strong {
    color: ${props => props.theme.accent}; /* Выделяем ник акцентным цветом */
  }

  span {
    opacity: 0.6;
  }
`;

export const AuthorName = styled.span<{ role?: string }>`
  font-weight: 600;
  color: ${props => props.role === 'Topiccreator' ? '#d39e00' : '#007bff'};
`;

/* --- Комментарии --- */
export const CommentContainer = styled.div`
  margin-top: 10px;
  padding: 12px 16px;
  background-color: ${props => props.theme.body}; /* Контрастный фон на фоне серой карточки */
  border-left: 3px solid ${props => props.theme.accent};
  border-radius: 8px;
  text-align: left;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;
export const CommentContent = styled.p`
  margin: 8px 0;
  color: ${props => props.theme.text};
  line-height: 1.4;
`;
export const DateText = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.text};
  opacity: 0.5;
`;

export const RepliesWrapper = styled.div`
  margin-left: 20px;
  border-left: 1px dashed ${props => props.theme.border};
  padding-left: 12px;
`;

/* --- Форма создания поста и комментариев --- */
export const FormWrapper = styled.form`
  background: ${props => props.theme.cardBg}; /* Серый фон как у карточек */
  padding: 25px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;

  input, textarea {
    width: 100%;
    box-sizing: border-box;
    /* Фон инпута делаем контрастным к карточке */
    background: ${props => props.theme.body}; 
    /* Текст инпута меняется: черный на белом / белый на черном */
    color: ${props => props.theme.text}; 
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    padding: 12px 15px;
    font-family: inherit;
    outline: none;

    &::placeholder {
      color: ${props => props.theme.text};
      opacity: 0.5;
    }
    
    &:focus {
      border-color: ${props => props.theme.accent};
    }
  }

  button {
    align-self: flex-end;
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }
`;
export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.accent};
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;
export const QuickReplyForm = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid ${props => props.theme.border};
    background: ${props => props.theme.cardBg};
    color: ${props => props.theme.text};
    outline: none;
    &:focus { border-color: ${props => props.theme.accent}; }
  }

  button {
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
  }
`;
/* --- Остальное --- */
export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: ${props => props.theme.cardBg}; /* Серый фон как у карточек */
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  text-align: center;

  p {
    font-size: 1.2rem;
    color: ${props => props.theme.text}; /* Текст станет белым в темной теме */
    opacity: 0.7;
    margin: 0;
  }
`;

export const Button = styled.button<{ variant: 'primary' | 'ghost' }>`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  border: ${props => props.variant === 'primary'
    ? 'none'
    : `2px solid ${props.theme.accent}`};
    
  background: ${props => props.variant === 'primary'
    ? props.theme.accent
    : 'transparent'};

  color: ${props => props.variant === 'primary'
    ? '#fff'
    : props.theme.accent}; /* Либо props.theme.text, если хочешь строгий вид */
`;

// Добавьте это для Sidebar, чтобы не было ошибок
export const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 280px; 
  height: 100vh; /* Используем полную высоту экрана */
  background-color: ${props => props.theme.headerBg}; /* Тепер фон динамічний */
  color: ${props => props.theme.text};             /* Колір тексту (Навігація) */
  border-right: 1px solid ${props => props.theme.border};
  z-index: 20;
  padding: 20px;
  box-sizing: border-box; /* Важно, чтобы паддинги не увеличивали размер */
  transition: transform 0.3s ease;
  transform: translateX(${props => (props.$isOpen ? "0" : "-100%")});
  display: flex; 
  flex-direction: column; /* Позволяет футеру прижаться вниз */
`;

export const SidebarHeader = styled.div`
display: flex; 
justify-content: space-between; 
align-items: center;
h3 {
    color: ${props => props.theme.text}; /* Заголовок "Навігація" */
  }
`;
export const CloseButton = styled.button`
background: none; 
border: none; 
font-size: 1.5rem; 
cursor: pointer;
color: ${props => props.theme.text}; 
  background: none;
  border: none;
`;
export const MenuContent = styled.nav`margin-top: 20px; display: flex; flex-direction: column; gap: 10px;`;
export const MenuItem = styled.div`
  color: ${props => props.theme.text};
  padding: 12px;
  text-decoration: none; /* Убираем подчеркивание ссылок */
  display: block;
  cursor: pointer;
  border-radius: 8px;

  /* Стиль для активной ссылки, который добавит NavLink */
  &.active {
    color: ${props => props.theme.accent};
    background-color: ${props => props.theme.accent}22;
    font-weight: bold;
  }

  &:hover {
    background-color: ${props => props.theme.accent}11;
  }
`;
export const Footer = styled.div`margin-top: auto; 
padding-top: 20px;
border-top: 1px solid ${props => props.theme.border};
`;
export const SocialLink = styled.a` 
color: ${props => props.theme.accent}; text-decoration: none; font-size: 0.9rem;`;
export const UserProfile = styled.div`display: flex; align-items: center; gap: 8px;`;
export const Username = styled.span`font-size: 0.9rem; font-weight: 500;`;
export const Avatar = styled.img`width: 32px; height: 32px; border-radius: 50%;`;
export const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); // Темный полупрозрачный фон
  backdrop-filter: blur(4px);    // Эффект размытия заднего плана
  z-index: 10;
  justify-content: center;
  align-items: center;
`;

// Само модальное окно
export const ModalBox = styled.div`
  background: ${props => props.theme.headerBg}; // Берем фон шапки для контраста
  color: ${props => props.theme.text};
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid ${props => props.theme.border};
  text-align: center;
`;

export const ModalTitle = styled.h2`
  margin-bottom: 24px;
  font-size: 1.8rem;
  color: ${props => props.theme.text};
`;

// Стилизация полей ввода внутри модалки
export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.border};
    background: ${props => props.theme.body};
    color: ${props => props.theme.text};
    font-size: 1rem;
    outline: none;

    &:focus {
      border-color: ${props => props.theme.accent};
    }
  }
`;

// Кнопка переключения между "Вход" и "Регистрация"
export const SwitchText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  opacity: 0.8;

  span {
    color: ${props => props.theme.accent};
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    margin-left: 5px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const CloseModal = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;
export const AuthButton = styled.button`
  margin-top: 10px;
  padding: 14px;
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(1.1); // Слегка осветляем при наведении
    transform: translateY(-1px); // Эффект приподнимания
    box-shadow: 0 4px 12px ${props => props.theme.accent}44; // Мягкое свечение
  }

  &:active {
    transform: translateY(0); // Возвращается при клике
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Стилизация инпутов (улучшенная версия)
export const AuthInput = styled.input`
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.border};
  background: ${props => props.theme.body}; // Инпут темнее/светлее фона окна
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    opacity: 0.5;
    color: ${props => props.theme.text};
  }

  &:focus {
    border-color: ${props => props.theme.accent};
  }
`;
export const TabContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  border-bottom: 1px solid #333; /* Фиксированный цвет вместо theme.current */
  padding-bottom: 10px;
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  /* Используем тернарник только для активного состояния */
  color: ${({ $isActive }) => ($isActive ? '#4a90e2' : '#999')}; 
  transition: all 0.3s ease;

  &:hover {
    color: #4a90e2;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -11px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #4a90e2;
    transform: scaleX(${({ $isActive }) => ($isActive ? 1 : 0)});
    transition: transform 0.3s ease;
    border-radius: 3px 3px 0 0;
  }
`;
export const TabBadge = styled.span`
  font-size: 0.75rem;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  vertical-align: middle;
`;
export const SectionTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #4a90e2; /* Прямой цвет, чтобы не лезли ошибки */
    border-left: 4px solid #4a90e2;
    padding-left: 15px;
`;

export const PlaceholderBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    background: rgba(128, 128, 128, 0.1); /* Универсальный полупрозрачный фон */
    border-radius: 15px;
    text-align: center;
    border: 2px dashed #444;

    h2 {
        color: #4a90e2;
        margin-bottom: 10px;
    }

    p {
        opacity: 0.7;
    }
`;
export const AuthPrompt = styled.div`
  background: ${props => props.theme.accent}11;
  border: 1px dashed ${props => props.theme.accent};
  color: ${props => props.theme.text};
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 20px;

  &:hover {
    background: ${props => props.theme.accent}22;
    transform: translateY(-2px);
  }

  strong {
    color: ${props => props.theme.accent};
    text-decoration: underline;
  }
`;
export const PostWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: ${props => props.theme.text};
`;

export const BackLink = styled.div`
  margin-bottom: 20px;
  a {
    color: ${props => props.theme.accent};
    text-decoration: none;
    font-weight: 600;
    &:hover { opacity: 0.8; }
  }
`;

export const FullPostCard = styled.article`
  background: ${props => props.theme.cardBg};
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const PostTitle = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
`;

export const PostContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${props => props.theme.text};
  opacity: 0.9;
  
  p { margin-bottom: 1.2rem; }
`;

export const CommentSection = styled.section`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid ${props => props.theme.border};
`;

// Используем твой FormWrapper для формы комментариев
export const CommentForm = styled.form`
  background: ${props => props.theme.cardBg};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;

  textarea {
    background: ${props => props.theme.body};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    padding: 15px;
    min-height: 120px;
    outline: none;
    &:focus { border-color: ${props => props.theme.accent}; }
  }

  button {
    align-self: flex-end;
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }
`;