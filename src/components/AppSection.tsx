import { useAppLogic } from './hooks/useAppLogic'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import * as S from './styled'
import { PostList } from './Post/Postlist'
import { GlobalStyle } from './styled'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PostForm } from './Post/PostForm'
import { ProfileView } from './ProfileView/ProfileView'
import { Header } from './Header/Header'
import { Sider } from './Sider'
import { Modal } from './Modal'
import { PostRoute } from './Post/PostRoute'
import { MessagesView } from './ProfileView/MessagesView'
export const AppSection: React.FC = () => {
    const { state, actions, currentUser } = useAppLogic(); //лагодимо юрл для працюючого серверу
    return (
        <BrowserRouter>
            <ThemeProvider theme={state.theme === 'light' ? lightTheme : darkTheme}>
                <GlobalStyle />
                <Header
                    user={state.userAuth || currentUser}
                    onMenuClick={actions.toggleSider}
                    onLoginCheck={actions.openLogin}
                    onRegisterCheck={actions.openRegister}
                    userAuth={state.userAuth}
                />
                <Sider
                    isOpen={state.visible}
                    onClose={() => actions.setVisible(false)}
                    user={state.userAuth || currentUser}
                    onThemeToggle={actions.toggleTheme}
                    currentTheme={state.theme}
                    onAuthClick={actions.openLogin}
                    userAuth={state.userAuth}
                />
                <Modal
                    isOpen={state.isAuthModalOpen}
                    onClose={() => actions.setAuthModalOpen(false)}
                    OnAuthSuccess={actions.handleAuth}
                    initialMode={state.modalMode}
                />
                <main className='container'>
                    <Routes>
                        <Route path="/" element={
                            <>
                                {state.userAuth?.role !== 'guest' ? (
                                    <PostForm onAddPost={actions.addPost} currentUser={state.userAuth || currentUser} OnAuthSuccess={actions.handleAuth} />
                                ) : (
                                    <S.AuthPrompt onClick={actions.openLogin}>Увійдіть, щоб писати</S.AuthPrompt>
                                )}
                                <PostList posts={state.posts} />
                            </>
                        } />
                        <Route path="/profile/:userId" element={<ProfileView />} />
                        <Route path='/messages' element={
                            <MessagesView
                                posts={state.posts}
                                allcomments={actions.allComment}
                                currentUser={state.userAuth || currentUser}
                            />
                        } />
                        <Route
                            path="/post/:id"
                            element={
                                <PostRoute
                                    posts={state.posts}
                                    userAuth={state.userAuth}
                                    onDelete={actions.deleteComment}
                                    onDeleteReply={actions.deleteReply}
                                    onAddComment={(postId: number, text: string) => {
                                        actions.addComment(postId, {
                                            text: text,
                                            author: state.userAuth || currentUser,
                                            postid: postId,
                                            replies: []
                                        });
                                    }}
                                />
                            }
                        />
                    </Routes>
                </main>
            </ThemeProvider>
        </BrowserRouter>
    );
};