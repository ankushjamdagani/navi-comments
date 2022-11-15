import { CommentsProvider } from "./context/commentsData";
import { useUser } from "./context/userData";

import Comments from "./components/comments";

function App() {
  const userData = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <CommentsProvider>
        <h1 className="App-header">Comments List</h1>
        <Comments userData={userData} />
      </CommentsProvider>
    </div>
  );
}

export default App;
