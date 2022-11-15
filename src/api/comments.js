const INITIAL_STATE = [
  {
    id: 1,
    content: "Message 1",
    authorId: 11,
    parentId: null,
    createdAt: 1668494133412,
    updatedAt: 1668494433412,
  },
  {
    id: 2,
    content: "Message 2",
    authorId: 1,
    parentId: null,
    createdAt: 1668494133412,
    updatedAt: null,
  },
  {
    id: 3,
    content: "Message 3",
    authorId: 11,
    parentId: null,
    createdAt: 1668494133412,
    updatedAt: null,
  },
  {
    id: 13823135275,
    content: "1.1",
    authorId: 1,
    parentId: 1,
    createdAt: 1668494185454,
    updatedAt: null,
  },
  {
    id: 269294709469,
    content: "1.1.1",
    authorId: 1,
    parentId: 13823135275,
    createdAt: 1668494189922,
    updatedAt: 1668494200137,
  },
  {
    id: 988293734856,
    content: "1.1.1.1",
    authorId: 1,
    parentId: 269294709469,
    createdAt: 1668494206587,
    updatedAt: null,
  },
  {
    id: 798188280130,
    content: "1.2",
    authorId: 1,
    parentId: 1,
    createdAt: 1668494212096,
    updatedAt: null,
  },
  {
    id: 487388887345,
    content: "1.3",
    authorId: 1,
    parentId: 1,
    createdAt: 1668494218207,
    updatedAt: null,
  },
  {
    id: 16857113177,
    content: "1.2.1",
    authorId: 1,
    parentId: 798188280130,
    createdAt: 1668494224769,
    updatedAt: null,
  },
];

function saveToDB(data) {
  localStorage.setItem("navi_comments", JSON.stringify(data));
}

function getFromDB() {
  try {
    const data = localStorage.getItem("navi_comments");
    if (!data) {
      saveToDB(INITIAL_STATE);
      return INITIAL_STATE;
    } else {
      return JSON.parse(data);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
}

// const flatToNestedTree = (list) => {
//   const hashTable = {};
//   list.forEach((aData) => (hashTable[aData.ID] = { ...aData, childNodes: [] }));
//   const dataTree = [];
//   list.forEach((aData) => {
//     if (aData.parentID)
//       hashTable[aData.parentID].childNodes.push(hashTable[aData.ID]);
//     else dataTree.push(hashTable[aData.ID]);
//   });
//   return dataTree;
// };

const CommentsAPI = {
  comments: getFromDB(),

  getComments() {
    return new Promise((resolve, reject) => {
      try {
        resolve({
          data: this.comments,
          status: {
            code: 200,
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  createComment({ content, authorId, parentId }) {
    return new Promise((resolve, reject) => {
      try {
        const currTime = Date.now();

        const newComment = {
          id: Math.floor(Math.random() * Math.floor(Math.random() * currTime)),
          content,
          authorId,
          parentId,
          createdAt: currTime,
          updatedAt: null,
        };

        this.comments = [...this.comments, newComment];

        saveToDB(this.comments);

        resolve({
          data: newComment,
          status: {
            code: 200,
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  updateComment({ id, content }) {
    return new Promise((resolve, reject) => {
      try {
        let updatedComment = null;

        this.comments = this.comments.map((comment) => {
          if (comment.id === id) {
            updatedComment = {
              ...comment,
              content,
              updatedAt: Date.now(),
            };
            return updatedComment;
          } else {
            return comment;
          }
        });

        saveToDB(this.comments);

        resolve({
          data: updatedComment,
          status: {
            code: 200,
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteComment({ id }) {
    return new Promise((resolve, reject) => {
      try {
        this.comments = this.comments.filter(
          (comment) => comment.id !== id && comment.parentId !== id
        );

        saveToDB(this.comments);

        resolve({
          status: {
            code: 200,
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default CommentsAPI;
