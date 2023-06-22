import * as React from 'react'
import './styles.css'

import { Spinner } from '../Spinner'

const Tag = ({ tag, onUnassign, unassigning = false }) => {
  const [hovering, setHovering] = React.useState(false)

  const handleUnassign = () => {
    onUnassign(tag.uuid);
  }

  const removeButtonClassname = [
    'remove-button',
    hovering ? '' : 'visually-hidden',
  ].join(' ')

  return (
    <li
      onMouseEnter={() => setHovering(true)}
      onFocus={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onBlur={() => setHovering(false)}
      className="tag rounded"
      style={{
        backgroundColor: tag.color,
        // Border and text color looks like a variant of the color that is defined on the `color` property of a tag.
        // If `color` is the "primary" color, then this might be considered the "secondary" color. In that case, it
        // should probably also be handled on the backend.
        // Here, I've just hard-coded the border for the meantime.
        borderColor: "grey",
      }}
      // tabIndex="0"
    >
      {tag.title}
      <button
        onClick={handleUnassign}
        aria-label={`Unassign tag ${tag.title}`}
        className={removeButtonClassname}
        disabled={unassigning}
      >
        <span className="visually-hidden">Unassign tag {tag.title}</span>
        {unassigning ? <Spinner /> : <>&#10006;</>}
      </button>
    </li>
  );
};

const TagLoading = () => (
  <li className={["tag", "tag-loading", "rounded"].join(" ")}>
    <Spinner />
  </li>
);

export { Tag, TagLoading }