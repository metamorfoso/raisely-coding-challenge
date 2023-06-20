import * as React from "react";

import { fetchTags, fetchUserTags } from "./api";

export function UserTags({ title, user }) {
  const [allTags, setAllTags] = React.useState(null);
  const [userTags, setUserTags] = React.useState(null);
  const [userTagObjects, setUserTagObjects] = React.useState(null);

  React.useEffect(() => {
    async function getUserTags() {
      const [allTags, userTags] = await Promise.all([
        fetchTags(),
        fetchUserTags(user.uuid)
      ]);
      setAllTags(allTags);
      setUserTags(userTags);
    }
    getUserTags();
  }, [user]);

  React.useEffect(() => {
    function mapTags() {
      if (!userTags) return;
      setUserTagObjects(
        userTags.map((tagId) => allTags.find((tag) => tag.uuid === tagId))
      );
    }
    mapTags();
  }, [user, allTags, userTags]);

  if (!userTagObjects) return null;

  return (
    <div>
      <h3>Tags</h3>
      <div>
        <ul>
          {userTagObjects.map((tag) => (
            <Tag key={tag.uuid} user={user} tag={tag} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Tag({ user, tag }) {
  return <li>{tag.title}</li>;
}
