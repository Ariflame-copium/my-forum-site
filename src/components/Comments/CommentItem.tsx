import type { ForumComment as CommentType } from '../types';
import { useState } from 'react';
import * as S from '../styled'
interface CommentItemProp {
    comment: CommentType
}
export const CommentItem: React.FC<CommentItemProp> = ({ comment }) => {
    const [reply, setReply] = useState(false)
    return (
        <S.CommentContainer>
            <S.CommentHeader>
                <S.AuthorName role={comment?.author?.role}>
                    {comment?.author?.username}
                    {comment?.author?.role === 'Topiccreator' && '(Автор)'}
                </S.AuthorName>
                <S.DateText>{comment?.createdAt}</S.DateText>
            </S.CommentHeader>
            <S.CommentContent>{comment?.text}</S.CommentContent>
            <S.ReplyButton onClick={() => setReply(!reply)}>
                {reply ? 'Скасувати' : 'Відповісти'}
            </S.ReplyButton>
            {reply && (
                <S.QuickReplyForm>
                    <input
                        type="text"
                        placeholder="Ваша відповідь..."
                        style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button style={{ background: '#646cff', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>
                        Ок
                    </button>
                </S.QuickReplyForm>
            )}
            <S.RepliesWrapper>
                {comment?.replies.map((reply) => (
                    <CommentItem key={reply?.id} comment={reply} />
                ))}
            </S.RepliesWrapper>
        </S.CommentContainer>
    )
}