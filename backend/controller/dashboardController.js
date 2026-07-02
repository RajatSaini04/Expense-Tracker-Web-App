const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Support range query param (default: income=60, expense=30)
        const range = parseInt(req.query.range) || null;
        const incomeRange = range || 60;
        const expenseRange = range || 30;

        const incomeStartDate = new Date(
            Date.now() - incomeRange * 24 * 60 * 60 * 1000
        );

        const expenseStartDate = new Date(
            Date.now() - expenseRange * 24 * 60 * 60 * 1000
        );

        // Run all database queries in parallel
        const [
            totalIncome,
            totalExpense,
            lastNDaysIncomeTransactions,
            lastNDaysExpenseTransactions,
            recentIncome,
            recentExpense,
        ] = await Promise.all([

            Income.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        isDeleted: { $ne: true },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                    },
                },
            ]),

            Expense.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        isDeleted: { $ne: true },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                    },
                },
            ]),

            Income.find({
                userId,
                isDeleted: { $ne: true },
                date: { $gte: incomeStartDate },
            })
                .sort({ date: -1 })
                .lean(),

            Expense.find({
                userId,
                isDeleted: { $ne: true },
                date: { $gte: expenseStartDate },
            })
                .sort({ date: -1 })
                .lean(),

            Income.find({
                userId,
                isDeleted: { $ne: true },
            })
                .sort({ date: -1 })
                .limit(5)
                .lean(),

            Expense.find({
                userId,
                isDeleted: { $ne: true },
            })
                .sort({ date: -1 })
                .limit(5)
                .lean(),
        ]);

        // Calculate totals for last N days
        const incomeLastNDaysTotal = lastNDaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const expenseLastNDaysTotal = lastNDaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Merge recent transactions
        const recentTransactions = [
            ...recentIncome.map((txn) => ({
                ...txn,
                type: 'income',
            })),
            ...recentExpense.map((txn) => ({
                ...txn,
                type: 'expense',
            })),
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        res.status(200).json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,

            totalExpense: totalExpense[0]?.total || 0,

            last30DaysExpenses: {
                total: expenseLastNDaysTotal,
                transactions: lastNDaysExpenseTransactions,
            },

            last60DaysIncome: {
                total: incomeLastNDaysTotal,
                transactions: lastNDaysIncomeTransactions,
            },

            recentTransactions,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message,
        });
    }
};