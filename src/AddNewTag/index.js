import * as React from "react";
import './styles.css'

const AddNewTag = ({
  parentInFocus,
  assignableTags = [],
  onCreateNew,
  onAssignExisting,
  assigningTag = false,
}) => {
  // Fetch all tags on mount, if not fetched? Probably not, as this is currently
  // handled in component state by an ancestor component. Ideally there'd be some
  // kind of central state store for this (like redux).

  const [showInput, setShowInput] = React.useState(false);
  const [addButtonFocused, setAddButtonFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const inputRef = React.useRef();
  const addNewButtonRef = React.useRef();

  const handleAddNewTagButtonClick = () => {
    setShowInput(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target?.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      setInputValue("");
      setShowInput(false);
      addNewButtonRef.current?.focus();
    }
  };

  const buildAssignExistingHandler = (uuid) => () => {
    setInputValue("");
    setShowInput(false);
    onAssignExisting(uuid);
  };

  const handleCreateNew = () => {
    setInputValue("");
    setShowInput(false);
    onCreateNew(inputValue);
  };

  const buildListItemKeyDownHandler = (uuid) => (event) => {
    if (event.key === "Enter") {
      const handleAssignExisting = buildAssignExistingHandler(uuid);
      handleAssignExisting();
    }
  };

  const showAssignableTags = inputValue?.length > 0;

  const showAddNewButton = parentInFocus && !showInput
  const showAddNewButtonLabel = parentInFocus && !showInput && addButtonFocused;

  return (
    <div>
      <div className="add-new-tag-button-wrapper">
        <input
          aria-label="Enter a tag name to look up or create"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          tabIndex="0"
          className={[
            showInput ? "" : "visually-hidden",
            "new-tag-input",
            "rounded",
          ].join(" ")}
          ref={inputRef}
          disabled={assigningTag}
        />
        <button
          aria-label="Add new tag"
          name="add-new-tag"
          tabIndex="0"
          ref={addNewButtonRef}
          onClick={handleAddNewTagButtonClick}
          onMouseEnter={() => setAddButtonFocused(true)}
          onFocus={() => setAddButtonFocused(true)}
          onMouseLeave={() => setAddButtonFocused(false)}
          onBlur={() => setAddButtonFocused(false)}
          className={[
            showAddNewButton ? "" : "visually-hidden",
            "add-new-tag-button",
          ].join(" ")}
        >
          +
        </button>
        <label
          htmlFor="add-new-tag"
          className={[
            showAddNewButtonLabel ? "" : "visually-hidden",
            "add-new-tag-button-label",
          ].join(" ")}
        >
          Add
        </label>
      </div>

      {showAssignableTags && (
        <ul
          className="assignable-tags-list"
          aria-label="List of existing tags that can be assigned"
        >
          {/* TODO: filter & sort assignable tags to best match current input value */}
          {assignableTags.map(({ uuid, title }) => (
            <li key={uuid} className="assignable-tags-list-item">
              <button
                className="tag-option-button rounded"
                onClick={buildAssignExistingHandler(uuid)}
                onKeyDown={buildListItemKeyDownHandler(uuid)}
              >
                {title}
              </button>
            </li>
          ))}
          <li className="assignable-tags-list-item">
            <button
              className="tag-option-button rounded"
              onClick={handleCreateNew}
              style={{
                textTransform: "uppercase",
              }}
              aria-label="Create tag"
            >
              <span
                className="add-new-tag-button"
                style={{
                  marginRight: "0.3rem",
                  height: "1.2rem",
                  width: "1.2rem",
                  fontSize: "1rem",
                }}
              >
                +
              </span>
              Create tag
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export { AddNewTag }