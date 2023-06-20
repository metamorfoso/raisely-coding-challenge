import "./styles.css";

import * as React from "react";

import {
  fetchTags,
  createTag,
  fetchUser,
  fetchUserTags,
  assignUserTag,
  removeUserTag
} from "./api";

import { UserTags } from "./Tags";

function UserProfile({ uuid }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    async function getUser() {
      const user = await fetchUser(uuid);
      setUser(user);
    }
    getUser();
  }, [uuid]);

  if (!user) return null;

  return <UserTags user={user} />;
}

// Let's pretend we're getting this from the route
// e.g. `get /users/:uuid`
const params = {
  uuid: "1111-2222-3333-4444"
};

export default function App() {
  return (
    <div className="App">
      <h1>User Tags Sandbox</h1>
      <p>
        For convenience we've added in some buttons that will excute the mocked
        API functions and log their results to the console. Feel free to play
        around and remove these
      </p>
      <button onClick={() => fetchTags().then(console.log)}>Get Tags</button>
      <button
        onClick={() => fetchUser("1111-2222-3333-4444").then(console.log)}
      >
        Get User
      </button>
      <button
        onClick={() => fetchUserTags("1111-2222-3333-4444").then(console.log)}
      >
        Get User Tags
      </button>
      <button
        onClick={() =>
          createTag({ title: "My tag " + Math.random() }).then(console.log)
        }
      >
        Create new tag
      </button>
      <button
        onClick={() =>
          assignUserTag("1111-2222-3333-4444", prompt("Enter a Tag UUID")).then(
            console.log
          )
        }
      >
        Assign Tag
      </button>
      <button
        onClick={() =>
          removeUserTag("1111-2222-3333-4444", prompt("Enter a Tag UUID")).then(
            console.log
          )
        }
      >
        Remove Tag
      </button>
      <div className="App">
        <UserProfile uuid={params.uuid} />
      </div>
    </div>
  );
}
