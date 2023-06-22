import * as React from "react";
import './Tags.css'

import {
  fetchTags,
  fetchUserTags,
  assignUserTag,
  createTag,
  removeUserTag,
} from "./api";

import { Tag, TagLoading } from './Tag'
import { AddNewTag } from './AddNewTag'

export function UserTags({ user }) {
  const [allTags, setAllTags] = React.useState(null);
  const [userTags, setUserTags] = React.useState(null);
  const [userTagObjects, setUserTagObjects] = React.useState(null);
  const [pickerInFocus, setPickerInFocus] = React.useState(false);

  const [assigningTag, setAssigningTag] = React.useState(false);

  React.useEffect(() => {
    async function getUserTags() {
      const [allTags, userTags] = await Promise.all([
        fetchTags(),
        fetchUserTags(user.uuid),
      ]);
      setAllTags(allTags);
      setUserTags(userTags);
    }
    getUserTags();
  }, [user]); // TODO: double check equality comparison of user object...

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

  const handleSelectExisting = async (tagUuid) => {
    const alreadyAssigned = userTags.includes(tagUuid);

    if (alreadyAssigned) {
      return;
    }

    setAssigningTag(true);
    const { tags } = await assignUserTag(user.uuid, tagUuid);
    setAssigningTag(false);
    setUserTags([...tags]);

    // TODO: error handling
  };

  const handleCreateNewAndAssign = async (title) => {
    setAssigningTag(true);
    const newTag = await createTag({ title });
    const { tags: updatedUserTags } = await assignUserTag(
      user.uuid,
      newTag.uuid
    );

    setAssigningTag(false);
    setUserTags([...updatedUserTags]);

    // TODO: error handling
  };

  const handleUnassign = async (tagUuid) => {
    const { tags } = await removeUserTag(user.uuid, tagUuid);
    setUserTags([...tags]);

    // TODO: error handling
  };

  const assignableTags = allTags.filter((tag) => !userTags.includes(tag.uuid));

  return (
    <div
      onMouseEnter={() => setPickerInFocus(true)}
      onFocus={() => setPickerInFocus(true)}
      onMouseLeave={() => setPickerInFocus(false)}
      onBlur={() => setPickerInFocus(false)}
    >
      <h3>Tags</h3>
      <div className="tags-list-wrapper">
        <ul className="tags-list">
          {userTagObjects.map((tag) => (
            <Tag
              key={tag.uuid}
              user={user}
              tag={tag}
              onUnassign={handleUnassign}
            />
          ))}
          {assigningTag && <TagLoading />}
        </ul>
        <AddNewTag
          assignableTags={assignableTags}
          parentInFocus={pickerInFocus}
          onCreateNew={handleCreateNewAndAssign}
          onAssignExisting={handleSelectExisting}
          assigningTag={assigningTag}
        />
      </div>
    </div>
  );
}

/*
TODO:
- <UserTags> styling
- <Tag> styling
  - text colour spec? (accessibility concern too)
  - border colour spec?

- add new button
  - show when tags comp hovered
  - hover state (colours + label)
  - clicked state (text input)

- new tag input
  - suggestions list on key down
  - create button
  - on select existing
    - API call to assign tag to user
    - update state
  - on create new tag
    - API call to create & assign tag
    - update state
  - optimistic UI or loading state? (loading state probably safer...)

Throughout:
- accessibility
  - semantic HTML
- testing
  - install react testing library?

Things I'm not doing:
- changing project language/framework (e.g. not porting to TS)
  - keeping createreactapp defaults as much as I can
- major changes to architecture & tooling
  - e.g. not changing from CSS to SASS/SCSS
  - just using default stylesheet configuration for static styles + inline react styles for more complex dynamic styles
  - not going to introduce anything like redux for central state management
  - not going to introduce anything to help manage REST api calls

Questions:
- is mobile support in scope?
  - what happens to the hover interaction on mobile?
- is there an intended way to cancel adding a new tag (make the input go away)?
  - just doing via escape key for now...
- once add new tag button is clicked, should the input not show when mouse leaves the tag picker?
  - assuming no
- max length for tag title?
  - not handling currently
- creating new tag with a title identical to an existing tag
  - backend should ideally handle that -- client should handle the error

Test assertions to make:
When:
On select existing:
- should not be able to assign if already assigned

On create new:
- should not be able to create one with the same name? (should probably be enforced on the backend)

On both:
- suggestions panel closes
- input goes away
- new tag appears

*/

