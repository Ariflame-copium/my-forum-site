import React from "react";
import type { Post, User } from "../types";
import { PostItem } from "./PostItem";
import * as S from '../styled'
import { useState } from "react";
interface PostProps {
  posts: Post[],
  user: User;
}
export const PostList: React.FC<PostProps> = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredPost = posts.filter(posts => posts.title.toLowerCase().includes(searchTerm.toLowerCase()))
  if (!posts) {
    return (
      <S.ListWrapper>
        <p>Завантаження постів</p>
      </S.ListWrapper>
    )
  }
  return (
    <S.ListWrapper>
      {filteredPost.length > 0 && (
        <input type="text"
          placeholder="Пошук посту"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '8px', width: '100%' }} />
      )}
      {filteredPost.length == 0 ? (
        <S.EmptyState>
          <p>Постів поки нема. Будь першим!</p>
        </S.EmptyState>
      ) : (
        filteredPost.map((post) => (
          <PostItem key={post?.id} post={post}></PostItem>
        ))
      )}
    </S.ListWrapper>
  );
}