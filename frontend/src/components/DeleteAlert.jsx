import React from 'react';

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-sm">{content}</p>
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onDelete}
          autoFocus
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
