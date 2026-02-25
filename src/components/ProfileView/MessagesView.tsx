import * as S from '../styled'
import { Link } from 'react-router-dom'
import type { User, ForumComment, Post } from '../types'
import type React from 'react'
interface messagesProp {
    posts: Post[],
    allcomments: ForumComment[],
    currentUser: User | null
}
export const MessagesView: React.FC<messagesProp> = ({ posts, allcomments, currentUser }) => {
    const currentUsername = currentUser?.username
    const commentView = allcomments.filter(c => c.author.username === currentUsername)
    return (
        <S.PostWrapper>
            <S.BackLink>
                <Link to="/" style={{ width: 'fit-content', display: 'block' }}>
                    ← Назад до стрічки
                </Link>
            </S.BackLink>

            <S.PostTitle>Ваша активність</S.PostTitle>

            {commentView.length > 0 ? (
                commentView.map(comment => {
                    console.log('Коментар:', comment)
                    const parentPost = posts.find(p => p.id === comment.postid);
                    return (
                        <S.Card key={comment?.id} style={{ marginBottom: '15px' }}>
                            <Link to={`/post/${comment?.postid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ fontSize: '0.85rem', color: '#646cff', marginBottom: '5px' }}>
                                    Пост: {parentPost?.title || "Видалений пост"}
                                </div>
                                <p style={{ margin: '0', opacity: 0.9 }}>
                                    <strong>Ви:</strong> {comment.text}
                                </p>
                                <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '8px' }}>
                                    {comment.createdAt}
                                </div>
                            </Link>
                        </S.Card>
                    );
                })
            ) : (
                <S.EmptyState>
                    <p>Ви ще не залишили жодного коментаря</p>
                </S.EmptyState>
            )}
        </S.PostWrapper>
    );
};