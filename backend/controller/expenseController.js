const Expense  = require('../models/Expense');
const xlsx = require('xlsx'); // Import the xlsx library for Excel file handling
const path = require('path'); // Import the path module for file handling


//ADD EXPENSE SOURCE 
exports.addExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
    const { icon ,category, amount, date } = req.body; // Destructure the request body
    //validation: check for missing fields
    if(!category || !amount || !date){
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }
     
    // Create a new income source
    const newExpense = await Expense.create({
        userId,
        icon,
        category,
        amount,
        date:new Date(date), // Convert date to a Date object
    
    });

    await newExpense.save(); // Save the new income source to the database
    res.status(201).json({
        success: true,
        message: 'Expense category added successfully',
        data: newExpense, // Return the created income source 
    })
}catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error adding expense category',
            error: error.message, // Return the error message
        });
    }
} 

// GET ALL Expense SOURCE
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 }); // Fetch all expense category for the user, sorted by date
        res.status(200).json({
            success: true,
            data: expense, // Return the fetched expense category
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error fetching expense category',
            error: error.message, // Return the error message
        });
    }

}

// DOWNLOAD EXPENSE SOURCE EXCEL
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        const expense = await Expense.find({ userId }).sort({date:-1}); 
        
        //prepare data for Excel 

        const data = expense.map((item)=>({
            category : item.category,
            Amount : item.amount,
            Date : item.date.toLocaleDateString(), // Format date as a string
        }));
         // Fetch all income sources for the user
        const wb = xlsx.utils.book_new() ;// Create a new workbook
        const ws = xlsx.utils.json_to_sheet(data); // Add a new worksheet
        xlsx.utils.book_append_sheet(wb, ws, 'Expense'); // Append the worksheet to the workbook
        const filePath = path.join(__dirname, '../downloads/expense_details.xlsx'); // store in separate folder
xlsx.writeFile(wb, filePath);
res.download(filePath);
    } catch (error) {
        console.error(error); // Log the error for debugging

        res.status(500).json({
            success: false,
            message: 'Error downloading expense category',
            error: error.message, // Return the error message
        });
    }
}

// DELETE EXPENSE CATEGORY
exports.deleteExpense = async (req, res) => {

    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id });

        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: 'Expense category not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Expense category deleted successfully',
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error deleting expense category',
            error: error.message, // Return the error message
        });
    }
}