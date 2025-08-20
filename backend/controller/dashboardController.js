const Income = require('../models/Income');
const Expense = require('../models/Expense');
const {isValidObjectId,Types} = require('mongoose');



// DashBoard Data
exports.getDashboardData = async (req, res) => {
    try {
   
    const userId = req.user._id; // Get user ID from the request
    const userObjectId = new Types.ObjectId(String(userId)); // Convert userId to ObjectId

    
        // Fetch total income and expense data for the user
        const totalIncome =await Income.aggregate([
            {  $match: { userId: userObjectId } }, // Match documents with the userId
            { $group: { _id: null, total: { $sum: '$amount' } } }, // Group by null to get total income
        ]);
        console.log("totalIncome",{totalIncome,userId:isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } }, // Match documents with the userId
            { $group: { _id: null, total: { $sum: '$amount' } } }, // Group by null to get total expense
        ]);
      
        
       //get income transaction in last 60 days 
       const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // Filter for the last 60 days
        }).sort({ date: -1 }); // Sort by date in descending order
     
       //get total income  for last 60 days

         const IncomeLast60Days =last60DaysIncomeTransactions.reduce((sum,transaction) => 
           sum + transaction.amount,0); // Sum the amounts of the transactions
        
       //get expense transaction in last 30 days
         const last30DaysExpenseTransactions = await Expense.find({
                userId,
                date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Filter for the last 30 days
          }).sort({ date: -1 }); // Sort by date in descending order

        
        //get total expense for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum,transaction) => 
            sum + transaction.amount,0); // Sum the amounts of the transactions

        //fetch last 5 transaction(income + expense)
        const lastTransactions = [
         ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
            (txn)=>({
            ...txn.toObject(), // Convert Mongoose document to plain object
            type: 'income', // Add a type field to identify the transaction type

        })
    ),
    ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
        (txn)=>({
            ...txn.toObject(), // Convert Mongoose document to plain object
            type: 'expense', // Add a type field to identify the transaction type

        })
    ),

] .sort((a,b)=>b.date-a.date)// Sort by date in descending order and limit to 5 transactions
//Final  Response 
res.json({
    totalBalance:
    (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
    totalIncome: totalIncome[0]?.total || 0,
    totalExpense: totalExpense[0]?.total || 0, 
    last30DaysExpenses:{
        total:expensesLast30Days,
        transactions:last30DaysExpenseTransactions,
    },
    last60DaysIncome:{
        total:IncomeLast60Days,
        transactions:last60DaysIncomeTransactions,
    },
    recentTransactions: lastTransactions,

});
    }catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message, // Return the error message
        });
    }
};



       