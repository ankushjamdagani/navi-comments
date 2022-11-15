import { createContext, useCallback, useContext, useState } from "react";

import CommentsAPI from "../api/comments";
import { useUser } from "./userData";

const CommentsContext = createContext();

export const useComments = () => {
  return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
  const [commentsById, setCommentsById] = useState({});
  const [commentsByParent, setCommentsByParent] = useState({ null: [] });

  const getComments = useCallback(
    async ({ pageNum = 1, perPage = 10, parentId = null } = {}) => {
      return CommentsAPI.getComments({ pageNum, perPage, parentId }).then(
        (res) => {
          const comments = {};
          const parents = {};
          res.data.forEach((comment) => {
            comments[comment.id] = comment;
            parents[comment.parentId] = [
              ...(parents[comment.parentId] || []),
              comment.id,
            ];
          });

          setCommentsById((curr) => ({ ...curr, ...comments }));
          setCommentsByParent((curr) => ({ ...curr, ...parents }));
        }
      );
    },
    []
  );

  const createComment = useCallback(async ({ content, authorId, parentId }) => {
    return CommentsAPI.createComment({ content, authorId, parentId }).then(
      (res) => {
        const newComment = res.data;
        setCommentsById((curr) => ({
          ...curr,
          [newComment.id]: newComment,
        }));
        setCommentsByParent((curr) => ({
          ...curr,
          [newComment.parentId]: [
            newComment.id,
            ...(curr[newComment.parentId] || []),
          ],
        }));
      }
    );
  }, []);

  const updateComment = useCallback(async ({ id, content }) => {
    return CommentsAPI.updateComment({ id, content }).then((res) => {
      const updatedComment = res.data;
      setCommentsById((curr) => ({
        ...curr,
        [updatedComment.id]: updatedComment,
      }));
    });
  }, []);

  const deleteComment = useCallback(
    async ({ id, content, parentId }) => {
      return CommentsAPI.deleteComment({ id, content }).then(() => {
        const toDelete = [id];
        while (toDelete.length) {
          const top = toDelete.shift();
          if (commentsByParent[top]) {
            toDelete.push(...commentsByParent[top]);
            delete commentsByParent[top];
          }
          if (commentsById[top]) {
            delete commentsById[top];
          }
        }

        setCommentsById({ ...commentsById });
        setCommentsByParent({
          ...commentsByParent,
          [parentId]: commentsByParent[parentId].filter(
            (commentId) => commentId !== id
          ),
        });
      });
    },
    [commentsById, commentsByParent]
  );

  return (
    <CommentsContext.Provider
      value={{
        commentsById,
        commentsByParent,
        getComments,
        updateComment,
        deleteComment,
        createComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};
