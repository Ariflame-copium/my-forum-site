import type { ForumComment } from "../types";
import { CommentItem } from "./CommentItem";
import * as S from '../styled'
interface CommentProp {
    comment: ForumComment[]
}
export const ForumComments: React.FC<CommentProp> = ({ comment }) => {
    return (
        <S.ListWrapper>
            {comment.length == 0 ? (
                <S.EmptyState>
                    <p>Коментарів поки нема. Будь першим!</p>
                </S.EmptyState>
            ) : (
                comment.map((comment) => (
                    <CommentItem key={comment.id} comment={comment}></CommentItem>
                ))
            )}
        </S.ListWrapper>
    );
}

