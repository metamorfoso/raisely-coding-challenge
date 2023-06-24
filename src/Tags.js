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

export function UserTags({ user }) {
  const [allTags, setAllTags] = React.useState(null);
  const [userTags, setUserTags] = React.useState(null);
  const [userTagObjects, setUserTagObjects] = React.useState(null);
  const [pickerInFocus, setPickerInFocus] = React.useState(false);

  const [assigningTag, setAssigningTag] = React.useState(false);
  const [unassigningTagId, setUnassigningTagId] = React.useState()

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
      handleError(error)
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
      handleError(error)
    } finally {
      setAssigningTag(false);
    }
  };

  const handleUnassign = async (tagUuid) => {
    try {
      setUnassigningTagId(tagUuid)
      const { tags } = await removeUserTag(user.uuid, tagUuid);
      setUserTags([...tags]);
    } catch (error) {
      handleError(error)
    } finally {
      setUnassigningTagId('')
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
              parentInFocus={pickerInFocus}
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

/*
Things I'm not doing (in terms of project setup):
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
- once add new tag button is clicked, should the input hide when mouse leaves the tag picker?
  - assuming no, input stays even if mouse leaves the tag picker
- max length for tag title?
  - not handling currently
  - IRL would ask the designer
- creating new tag with a title identical to an existing tag
  - backend should ideally handle that -- client should handle the error
- what happens when more tags are added than can fit on one line?
  - assuming just wrap to next line

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

