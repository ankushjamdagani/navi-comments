import { useState } from "react";

const CommentsForm = ({ label, initial, onApply, onCancel }) => {
  const [value, setValue] = useState(initial);

  const _onApply = (e) => {
    e.preventDefault();
    onApply(value);
    setValue("");
  };

  const _onCancel = () => {
    onCancel?.();
    setValue("");
  };

  return (
    <form onSubmit={_onApply}>
      <label>{label}</label>
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="form-actions">
        {(onCancel || value) && (
          <button className="button-gray-bordered" onClick={_onCancel}>
            Cancel
          </button>
        )}{" "}
        <input type="submit" value="Submit" disabled={!value} />
      </div>
    </form>
  );
};

export default CommentsForm;
