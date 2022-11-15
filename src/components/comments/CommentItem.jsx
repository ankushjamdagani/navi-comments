import { useState } from "react";

import CommentsForm from "./CommentsForm";

const CommentItem = ({
  userId,
  data,
  commentsById,
  commentsByParent,
  updateComment,
  deleteComment,
  createComment,
  maxLevel,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [isReplying, setReplying] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const replies = commentsByParent[data.id];
  const hasWriteAccess = data.authorId === userId;

  const onApplyEdit = (content) => {
    updateComment({ ...data, content }).then(() => {
      setEditing(false);
    });
  };

  const onCancelEdit = () => {
    setEditing(false);
  };

  const onApplyReply = (content) => {
    createComment({ content, authorId: userId, parentId: data.id }).then(() => {
      setReplying(false);
    });
  };

  const onCancelReply = () => {
    setReplying(false);
  };

  const onDeleteComment = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete the comment?"
    );

    if (shouldDelete) {
      setDeleting(true);
      deleteComment(data);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-body">
        {!isEditing && <div className="comment-body-text">{data.content}</div>}
        {!isEditing && (
          <div className="comment-body-meta">
            <em>{new Date(data.createdAt).toLocaleString()} </em>
            {data.updatedAt ? <strong>(Edited)</strong> : ""}
          </div>
        )}
        {isEditing && (
          <CommentsForm
            label="Edit Comment"
            initial={data.content}
            onApply={onApplyEdit}
            onCancel={onCancelEdit}
          />
        )}
      </div>
      <div className="comment-actions">
        {hasWriteAccess && (
          <button onClick={() => setEditing(true)} disabled={isEditing}>
            Edit
          </button>
        )}
        {!!maxLevel && (
          <button onClick={() => setReplying(true)} disabled={isReplying}>
            Reply
          </button>
        )}
        {hasWriteAccess && (
          <button
            className="button-red"
            onClick={onDeleteComment}
            disabled={isDeleting}
          >
            Delete
          </button>
        )}
      </div>
      <div className="comment-replies">
        {isReplying && (
          <CommentsForm
            label="Reply"
            onApply={onApplyReply}
            onCancel={onCancelReply}
          />
        )}
        {replies?.map((commentId) => {
          const comment = commentsById[commentId];
          return (
            <CommentItem
              key={comment.id}
              data={comment}
              userId={userId}
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
    </div>
  );
};

export default CommentItem;
