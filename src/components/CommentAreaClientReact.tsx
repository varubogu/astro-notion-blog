import React, { useEffect, useState } from 'react';
import '../styles/notion-color.css';

export interface Post {
  Slug: string;
}

interface Props {
  post: Post;
  backendUrl: string;
}

interface Comment {
  commenter: string;
  comment: string;
}

const CommentAreaClientReact: React.FC<Props> = ({ post, backendUrl }) => {

  if (!backendUrl) {
    return null
  }

  const url = `${backendUrl}/api/v1/comments/get/${post.Slug}`;
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.Slug]);

  return (
    <div>
      <hr />
      <p>コメント</p>
      <hr />
      <div id="comments">
        {comments.map((comment, index) => (
          <div key={index}>
            <div>
              <p>名前: {comment.commenter}</p>
            </div>
            <div>
              <p>{comment.comment}</p>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentAreaClientReact;
