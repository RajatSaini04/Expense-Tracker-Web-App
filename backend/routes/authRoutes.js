const express = require('express');
const user = require('../models/User'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
const {Protect} = require('../middleware/authMiddleware');



const {
    registerUser,
    loginUser,
    getUserInfo,
    
   
}= require('../controller/authController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser',Protect, getUserInfo);
router.post('/upload-image',upload.single('profileImage'), async (req, res) => {
   if(!req.file){
    return res .status(400).json({message:'No file uploaded'});
   }
   const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
   res.status(200).json({
   
    message:'File uploaded successfully',
    imageUrl,
   });
});

module.exports = router;

