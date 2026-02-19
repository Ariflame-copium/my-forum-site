import { useParams, Link } from "react-router-dom";
import * as S from '../styled'
import type { Post, User } from "../types";
interface RouteProp {
    posts: Post[];
    userAuth: User | null;
    onAddComment: (postId: number, text: string, user: User) => void
    onDelete: (postId: number) => void
    onDeleteReply: (postId: number, commentId: number) => void
}
export const PostRoute: React.FC<RouteProp> = ({ posts, userAuth, onAddComment, onDelete, onDeleteReply }) => {
    const { id } = useParams<{ id: string }>()
    const post = posts.find(p => p.id === Number(id))
    if (!post) return <div>Пост не знайдено</div>;

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get('commentText') as string;

        if (text.trim() && userAuth) {
            onAddComment(post.id, text, userAuth);
            e.currentTarget.reset();
        }
    };

    return (
        <S.PostWrapper>
            <Link to={'/'} style={{
                color: 'inherit',
                textDecoration: 'none',
                marginBottom: '20px',
                display: 'block',
                width: 'fit-content'
            }}>
                ← Назад до стрічки
            </Link>

            <S.PostTitle>{post.title}</S.PostTitle>
            <S.AuthorInfo>
                <Link
                    to={`/profile/${post.author?.id}`}
                    style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    {post.author?.username}
                </Link>
                <span>{post.createdAt}</span>
            </S.AuthorInfo>

            <S.Content style={{ margin: '20px 0' }}>
                {post.content.map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: '15px', lineHeight: '1.6' }}>{paragraph}</p>
                ))}
            </S.Content>

            <hr style={{ borderColor: 'rgba(128,128,128,0.2)', margin: '30px 0' }} />

            <div className="comments-section">
                <h3 style={{ marginBottom: '20px' }}>Коментарі ({post.comments?.length || 0})</h3>

                <div style={{ marginBottom: '30px' }}>
                    {post.comments?.map(comment => (
                        <div key={comment.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(128,128,128,0.2)',
                            padding: '15px 0'
                        }}>

                            <div style={{ flex: 1 }}>
                                <Link
                                    to={`/profile/${comment?.author?.id}`}
                                    style={{ color: '#646cff', textDecoration: 'none', fontWeight: 'bold' }}
                                >
                                    {comment?.author?.username}
                                </Link>
                                : {comment?.text}
                            </div>


                            {(userAuth?.role === 'admin' || userAuth?.username === comment?.author?.username) && (
                                <button
                                    onClick={() => onDeleteReply(post?.id, comment?.id)}
                                    className="delete-comment-btn"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        marginLeft: '10px'
                                    }}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {userAuth && userAuth?.role !== 'guest' ? (
                    <S.FormWrapper onSubmit={handleCommentSubmit}>
                        <textarea name="commentText" placeholder="Напишіть коментар..." required />
                        <button type="submit">Додати коментар</button>
                    </S.FormWrapper>
                ) : (
                    <S.EmptyState>
                        <p>Увійдіть, щоб залишати коментарі</p>
                    </S.EmptyState>
                )}

                {(userAuth?.role === 'admin' || userAuth?.username === post?.author?.username) && (
                    <button
                        onClick={() => onDelete(post.id)}
                        className="delete-btn"
                        style={{ marginTop: '40px', opacity: 0.6 }}
                    >
                        Видалити весь пост
                    </button>
                )}
            </div>
        </S.PostWrapper>
    );
}