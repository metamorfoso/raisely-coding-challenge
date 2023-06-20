/**
 * This is a simulation of the Raisely API, it has all of the methods you'll need
 * to fetch tags, create a new tag, assign a tag, remove a tag and fetch a user's
 * tags
 *
 * You can treat this as if it is a remote API, it's not a replacement for state
 * management in your application.
 *
 * You don't need to touch this code, it's missing error handling and validation
 * and is a simpification of how the actual API would work.
 */

import uuid from "uuid/dist/v4";

/**
 * Parameters
 */
const latency = 500;

/**
 * Mocked data storage
 */
const tags = [
  {
    uuid: "aaaa-bbbb-cccc-dddd",
    title: "Donor",
    color: "red"
  },
  {
    uuid: "eeee-ffff-gggg-hhhh",
    title: "Fundraiser",
    color: "blue"
  }
];

const users = [
  {
    uuid: "1111-2222-3333-4444",
    fullName: "Aizah Wilkerson",
    tags: ["aaaa-bbbb-cccc-dddd"]
  }
];

const tagColors = ["#C8E8FF", "#B2419A", "#B7EDD5", "#EDB7B7", "#4654B2"];

/**
 * Chooses a random tag color
 * @returns {string} The generated color
 */
const generateTagColor = () => {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
};

/**
 * Fetch all available tags
 * @returns {Promise<tag[]>} An array of all tags
 */
export const fetchTags = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tags);
    }, latency);
  });
};

/**
 * Save a new tag
 * @param {tag} newTag - The data for a new tag to be created
 * @returns {Promise<tag>} The resulting tag model including uuid
 */
export const createTag = (newTag) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const constructedTag = {
        uuid: uuid(), // UUID is automatically generated on submission
        title: newTag.title,
        color: generateTagColor()
      };
      tags.push(constructedTag);
      resolve(constructedTag);
    }, latency);
  });
};

/**
 * Fetch a user
 * @param {string} uuid - The UUID of the user to find
 * @returns {Promise<user>} A user object with the matching UUID
 */
export const fetchUser = (uuid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.uuid === uuid);
      resolve(user);
    }, latency);
  });
};

/**
 * Fetch a user's tags
 * @param {string} uuid - The UUID of the user to find
 * @returns {Promise<tag[]>} An array of tags assigned to the user with the matching UUID
 */
export const fetchUserTags = (userUuid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.uuid === userUuid);
      resolve(user.tags);
    }, latency);
  });
};

/**
 * Assign a tag to a user
 * @param {string} userUuid - The UUID of the user to apply the tag to
 * @param {string} tagUuid - The UUID of the tag to be applied
 * @returns {Promise<user>} The updated user model, including the new value for the `tags` array
 */
export const assignUserTag = (userUuid, tagUuid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.uuid === userUuid);
      user.tags.push(tagUuid);
      resolve(user);
    }, latency);
  });
};

/**
 * Remove a tag from a user
 * @param {string} userUuid - The UUID of the user to remove the tag from
 * @param {string} tagUuid - The UUID of the tag to be removed
 * @returns {Promise<user>} The updated user model, including the new value for the `tags` array
 */
export const removeUserTag = (userUuid, tagUuid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.uuid === userUuid);
      user.tags = user.tags.filter((t) => t !== tagUuid);
      resolve(user);
    }, latency);
  });
};
