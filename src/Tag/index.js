import * as React from 'react'
import './styles.css'

const Tag = ({ user, tag, onUnassign }) => {
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
      className="tag"
      style={{ backgroundColor: tag.color }}
      // tabIndex="0"
    >
      {tag.title}
      <button
        onClick={handleUnassign}
        aria-label={`Unassign tag ${tag.title}`}
        className={removeButtonClassname}
      >
        <span className="visually-hidden">Unassign tag {tag.title}</span>
        &#10006;
      </button>
    </li>
  );
};

export { Tag }