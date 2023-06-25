import "./styles.css";

import * as React from "react";

import { fetchUser } from "./api";

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
      <UserProfile uuid={params.uuid} />
    </div>
  );
}
