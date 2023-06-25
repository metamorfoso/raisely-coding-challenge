import * as React from "react";
import './styles.css'

import {
  fetchTags,
  fetchUserTags,
  assignUserTag,
  createTag,
  removeUserTag,
} from "../api";

import { Tag, TagLoading } from './Tag'
import { AddNewTag } from './AddNewTag'

const handleError = (error) => {
  console.log('Error handling stub:', error)
  /*
  I've assumed here some notification system could be used to alert the user, like a toast.

  Ideally, errors would to be handled explicitly and granularly.

  The message to the user should be clear about:
  - what happened
  - why it happened
  - what they can do next

  e.g. `We couldn't assign the tag ${tag.title} because of ${reasonForError}`

  Where reasonForError might be network-related, or an issue on the backend, etc.
  */
}

const getHasFinePointer = () => {
  if (!window || typeof window?.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(pointer: fine)")?.matches;
};

export function UserTags({ user }) {
  const [allTags, setAllTags] = React.useState(null);
  const [userTags, setUserTags] = React.useState(null);
  const [userTagObjects, setUserTagObjects] = React.useState(null);
  const [pickerInFocus, setPickerInFocus] = React.useState(false);

  const [assigningTag, setAssigningTag] = React.useState(false);
  const [unassigningTagId, setUnassigningTagId] = React.useState();

  const hasFinePointer = getHasFinePointer();

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

    try {
      setAssigningTag(true);
      const { tags } = await assignUserTag(user.uuid, tagUuid);
      setUserTags([...tags]);
    } catch (error) {
      handleError(error);
    } finally {
      setAssigningTag(false);
    }
  };

  const handleCreateNewAndAssign = async (title) => {
    try {
      setAssigningTag(true);
      const newTag = await createTag({ title });
      const { tags: updatedUserTags } = await assignUserTag(
        user.uuid,
        newTag.uuid
      );

      setUserTags([...updatedUserTags]);
    } catch (error) {
      handleError(error);
    } finally {
      setAssigningTag(false);
    }
  };

  const handleUnassign = async (tagUuid) => {
    try {
      setUnassigningTagId(tagUuid);
      const { tags } = await removeUserTag(user.uuid, tagUuid);
      setUserTags([...tags]);
    } catch (error) {
      handleError(error);
    } finally {
      setUnassigningTagId("");
    }
  };

  const assignableTags = allTags.filter((tag) => !userTags.includes(tag.uuid));

  return (
    <div
      onMouseEnter={() => setPickerInFocus(true)}
      onFocus={() => setPickerInFocus(true)}
      onMouseLeave={() => setPickerInFocus(false)}
      onBlur={() => setPickerInFocus(false)}
      className="container"
    >
      <h3 className="heading">Tags</h3>
      <div className="tags-list-wrapper">
        <ul className="tags-list">
          {userTagObjects.map((tag) => (
            <Tag
              key={tag.uuid}
              user={user}
              tag={tag}
              onUnassign={handleUnassign}
              unassigning={unassigningTagId === tag.uuid}
            />
          ))}
          {assigningTag && <TagLoading />}

          <li>
            <AddNewTag
              assignableTags={assignableTags}
              parentInFocus={hasFinePointer ? pickerInFocus : true}
              onCreateNew={handleCreateNewAndAssign}
              onAssignExisting={handleSelectExisting}
              assigningTag={assigningTag}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
