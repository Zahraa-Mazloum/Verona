import Investment from '../models/investmentsModel.js';
import Contract from '../models/contractModel.js';
import Investor from '../models/investorModel.js';

// Get investment statistics
export const dashboardStates = async (req, res) => {
    try {
        // Total investors
        const totalInvestors = await Investor.countDocuments();

        // Total amount of investments
        const totalAmount = await Investment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Active investments
        const activeInvestments = await Investment.countDocuments({ invesmentStatus: true });

        // Total invested per month
        const totalInvestedPerMonth = await Investment.aggregate([
            { $group: { _id: { month: { $month: '$startDate' }, year: { $year: '$startDate' } }, total: { $sum: '$amount' } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top 3 investors
        const topInvestors = await Investment.aggregate([
            { $group: { _id: '$investorInfo', totalAmount: { $sum: '$amount' } } },
            { $sort: { totalAmount: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'investors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'investor'
                }
            },
            { $unwind: '$investor' },
            {
                $project: {
                    name: '$investor.name',
                    totalAmount: 1
                }
            }
        ]);

        // Overall investments per type
        const investmentsPerType = await Investment.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $lookup: {
                    from: 'types',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'type'
                }
            },
            { $unwind: '$type' },
            {
                $project: {
                    title: '$type.title',
                    totalAmount: 1
                }
            }
        ]);

        res.status(200).json({
            totalInvestors,
            totalAmount: totalAmount[0] ? totalAmount[0].total : 0,
            activeInvestments,
            totalInvestedPerMonth,
            topInvestors,
            investmentsPerType
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const dashboardController = {dashboardStates}
export default dashboardController;