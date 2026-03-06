import React from "react";
import type { Post, User } from "../types";
import { PostItem } from "./PostItem";
import * as S from '../styled'
import { useState } from "react";
interface PostProps {
  posts: Post[],
  currentUser: User | null
}
export const PostList: React.FC<PostProps> = ({ posts, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const currentUsername = currentUser?.username
  const findPost = posts.filter(p => p.author.username === currentUsername)
  const filteredPost = findPost.filter(posts => posts.title.toLowerCase().includes(searchTerm.toLowerCase()))
  if (!posts) {
    return (
      <S.ListWrapper>
        <p>Завантаження постів</p>
      </S.ListWrapper>
    )
  }
  return (
    <S.ListWrapper>
      {findPost.length > 0 && (
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