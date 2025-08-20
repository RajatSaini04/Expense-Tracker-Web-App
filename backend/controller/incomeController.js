const Income  = require('../models/Income');
const xlsx = require('xlsx'); // Import the xlsx library for Excel file handling
const path = require('path'); // Import the path module for file handling



//ADD INCOME SOURCE 
exports.addIncome = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
    const { icon ,source, amount, date } = req.body; // Destructure the request body
    //validation: check for missing fields
    if(!source || !amount || !date){
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }
     
    // Create a new income source
    const newIncome = await Income.create({
        userId,
        icon,
        source,
        amount,
        date:new Date(date), // Convert date to a Date object
    
    });

    await newIncome.save(); // Save the new income source to the database
    res.status(201).json({
        success: true,
        message: 'Income source added successfully',
        data: newIncome, // Return the created income source 
    })
}catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error adding income source',
            error: error.message, // Return the error message
        });
    }
} 

// GET ALL INCOME SOURCE
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        const income = await Income.find({ userId }).sort({ date: -1 }); // Fetch all income sources for the user, sorted by date
        res.status(200).json({
            success: true,
            data: income, // Return the fetched income sources
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error fetching income sources',
            error: error.message, // Return the error message
        });
    }

}

// DOWNLOAD INCOME SOURCE EXCEL
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id; // Get user ID from the request

    try {
        const income = await Income.find({ userId }).sort({date:-1}); 
        
        //prepare data for Excel 

        const data = income.map((item)=>({
            Source : item.source,
            Amount : item.amount,
            Date : item.date.toLocaleDateString(), // Format date as a string
        }));
         // Fetch all income sources for the user
        const wb = xlsx.utils.book_new() ;// Create a new workbook
        const ws = xlsx.utils.json_to_sheet(data); // Add a new worksheet
        xlsx.utils.book_append_sheet(wb, ws, 'Income'); // Append the worksheet to the workbook
        const filePath = path.join(__dirname, '../downloads/income_details.xlsx'); // store in separate folder
        xlsx.writeFile(wb, filePath);
        res.download(filePath);
    } catch (error) {
        console.error(error); // Log the error for debugging

        res.status(500).json({
            success: false,
            message: 'Error downloading income sources',
            error: error.message, // Return the error message
        });
    }
}

// DELETE INCOME SOURCE
exports.deleteIncome = async (req, res) => {

    try {
        const deletedIncome = await Income.findOneAndDelete({ _id: req.params.id });

        if (!deletedIncome) {
            return res.status(404).json({
                success: false,
                message: 'Income source not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Income source deleted successfully',
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error deleting income source',
            error: error.message, // Return the error message
        });
    }
}