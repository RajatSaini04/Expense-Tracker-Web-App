import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import toast from 'react-hot-toast';

const ProfilePhotoSelector = ({ image, setImage, existingImageUrl }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Validate file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImage(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const displayUrl = previewUrl || (image ? null : existingImageUrl);

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image && !displayUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full relative">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 border-2 border-primary hover:scale-110 transition-transform cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl || displayUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          {image ? (
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 hover:scale-110 transition-transform cursor-pointer"
              onClick={handleRemoveImage}
            >
              <LuTrash />
            </button>
          ) : (
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 border-2 border-primary hover:scale-110 transition-transform cursor-pointer"
              onClick={onChooseFile}
            >
              <LuUpload />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;