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
        const activeInvestments = await Investment.countDocuments({ investmentStatus: true });

        // Total invested per month
        const totalInvestedPerMonth = await Contract.aggregate([
            {
                $lookup: {
                    from: 'Currency',
                    localField: 'currency',
                    foreignField: '_id',
                    as: 'currency'
                }
            },
            { $unwind: '$currency' },
            {
                $group: {
                    _id: { 
                        month: { $month: '$startDate' }, 
                        year: { $year: '$startDate' },
                        currency: '$currency.symbol' 
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.currency': 1 } }
        ]);

        // Top 3 investors
        const topInvestors = await Contract.aggregate([
            {
              $group: {
                _id: { investorInfo: '$investorInfo', currency: '$currency' },
                totalAmount: { $sum: '$amount' },
                profit: { $sum: '$profit' }
              }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 3 },
            {
              $lookup: {
                from: 'Investors',
                localField: '_id.investorInfo',
                foreignField: '_id',
                as: 'investor'
              }
            },
            { $unwind: '$investor' },
            {
              $lookup: {
                from: 'Currency',
                localField: '_id.currency',
                foreignField: '_id',
                as: 'currency'
              }
            },
            { $unwind: '$currency' },
            {
              $project: {
                name: '$investor.fullname_en',
                namear: '$investor.fullname_ar',
                currency: '$currency.symbol',
                totalAmount: 1,
                profit: 1
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
                    title: '$type.type_en',
                    titlear:'$type.type_ar',
                    totalAmount: 1
                }
            }
        ]);

        // Overall investments per title
        const investmentsPerTitle = await Investment.aggregate([
            {
                $group: {
                    _id: '$titleInv',  // Group by the title of the investment
                    totalAmount: { $sum: '$amount' }  // Sum the amounts for each title
                }
            },
            {
                $project: {
                    _id: 0,            // Remove the _id field from the output
                    title: '$_id',     // Rename _id to title in the output
                    totalAmount: 1     // Keep the totalAmount field
                }
            }
        ]);

        res.status(200).json({
            totalInvestors,
            totalAmount: totalAmount[0] ? totalAmount[0].total : 0,
            activeInvestments,
            totalInvestedPerMonth,
            topInvestors,
            investmentsPerType,
            investmentsPerTitle
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const dashboardController = { dashboardStates };
export default dashboardController;
