import { useEffect } from "react";

import { useComments } from "../../context/commentsData";

import CommentsForm from "./CommentsForm";
import CommentItem from "./CommentItem";

const RootNodeID = "null";

const Comments = ({ userData, maxLevel = 4 }) => {
  const {
    commentsById,
    commentsByParent,
    getComments,
    updateComment,
    deleteComment,
    createComment,
  } = useComments();

  useEffect(() => {
    getComments();
  }, [getComments]);

  const comments = commentsByParent[RootNodeID];

  return (
    <div className="comments-wrapper">
      <CommentsForm
        label="Comment"
        onApply={(content) =>
          createComment({
            authorId: userData.id,
            parentId: RootNodeID,
            content,
          })
        }
      />
      {comments.map((commentId) => {
        const comment = commentsById[commentId];
        return (
          <CommentItem
            key={comment.id}
            data={comment}
            userId={userData.id}
            commentsById={commentsById}
            commentsByParent={commentsByParent}
            updateComment={updateComment}
            deleteComment={deleteComment}
            createComment={createComment}
            maxLevel={maxLevel - 1}
          />
        );
      })}
    </div>
  );
};

export default Comments;
