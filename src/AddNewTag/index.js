import * as React from "react";

const AddNewTag = ({
  parentInFocus,
  assignableTags = [],
  onCreateNew,
  onAssignExisting,
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
    // addNewButtonRef.current?.focus()
    setShowInput(false);
    onAssignExisting(uuid);
  };

  const handleCreateNew = () => {
    setInputValue("");
    // addNewButtonRef.current?.focus()
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
    <>
      <input
        aria-label="Enter a tag name to look up or create"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        tabIndex="0"
        className={[showInput ? "" : "visually-hidden"].join(" ")}
        ref={inputRef}
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
        className={[showAddNewButton ? "" : "visually-hidden"].join(" ")}
      >
        +
      </button>
      <label
        htmlFor="add-new-tag"
        className={[showAddNewButtonLabel ? "" : "visually-hidden"].join(" ")}
      >
        Add
      </label>

      {showAssignableTags && (
        <ul aria-label="List of existing tags that can be assigned">
          {/* TODO: filter & sort assignable tags to best match current input value */}
          {assignableTags.map(({ uuid, title }) => (
            <li key={uuid}>
              <button
                onClick={buildAssignExistingHandler(uuid)}
                onKeyDown={buildListItemKeyDownHandler(uuid)}
              >
                {title}
              </button>
            </li>
          ))}
          <li>
            <button onClick={handleCreateNew}>Create tag</button>
          </li>
        </ul>
      )}
    </>
  );
};

export { AddNewTag }