import React from "react";
import type { Post } from "../types";
import { Link } from "react-router-dom";
import * as S from '../styled'
interface PostItemProp {
    post: Post
}
export const PostItem: React.FC<PostItemProp> = ({ post }) => {
    return (
        <S.Card>
            <S.Title>{post?.title} </S.Title>
            <S.AuthorInfo>
                <Link to={`/profile/${post?.author?.id}`}>{post?.author?.username}</Link>
                <span>{post?.author?.role}</span>
                <span>{post?.createdAt}</span>
            </S.AuthorInfo>
            <div style={{ marginTop: '10px' }}>
                <Link to={`/post/${post?.id}`} style={{ color: '#646cff', fontSize: '0.9rem' }}>
                    Читати далі та коментувати ({post?.comments?.length || 0})
                </Link>
            </div>
        </S.Card>
    )
}