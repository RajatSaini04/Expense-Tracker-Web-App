const express = require('express');



const { 
    addExpense,
    getAllExpense,
    downloadExpenseExcel,
     deleteExpense
     } = require('../controller/expenseController');

const { Protect } = require('../middleware/authMiddleware');     
const router = express.Router();

router.post('/add', Protect, addExpense);
router.get('/get', Protect, getAllExpense);
router.get('/download', Protect, downloadExpenseExcel);
router.delete('/:id', Protect, deleteExpense);

module.exports = router;
