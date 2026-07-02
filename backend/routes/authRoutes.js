const express = require('express');
const { Protect } = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getUserInfo,
    updateProfile,
    changePassword,
} = require('../controller/authController');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// User
router.get('/getUser', Protect, getUserInfo);
router.patch('/update-profile', Protect, updateProfile);
router.patch('/change-password', Protect, changePassword);

// Upload Profile Image
router.post(
    '/upload-image',
    Protect,
    upload.single('profileImage'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully',
                imageUrl: req.file.path, // Cloudinary URL
            });
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);

            res.status(500).json({
                success: false,
                message: 'Image upload failed',
                error: error.message,
            });
        }
    }
);

module.exports = router;