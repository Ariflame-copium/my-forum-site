import React from "react";
import type { Post } from "../types";
import { PostItem } from "./PostItem";
import * as S from '../styled'
interface PostProps {
  posts: Post[]
}
export const PostList: React.FC<PostProps> = ({ posts }) => {
  if (!posts) {
    return (
      <S.ListWrapper>
        <p>Завантаження постів</p>
      </S.ListWrapper>
    )
  }
  return (
    <S.ListWrapper>
      {posts.length == 0 ? (
        <S.EmptyState>
          <p>Постів поки нема. Будь першим!</p>
        </S.EmptyState>
      ) : (
        posts.map((post) => (
          <PostItem key={post?.id} post={post}></PostItem>
        ))
      )}
    </S.ListWrapper>
  );
}