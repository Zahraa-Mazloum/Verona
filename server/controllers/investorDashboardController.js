import Investment from '../models/investmentsModel.js';
import Contract from '../models/contractModel.js';
import Investor from '../models/investorModel.js';

export const investorDashboardStates = async (req, res) => {
    try {
        const investorId = req.user._id; 

        // Total amount invested by this investor
        const totalAmount = await Investment.aggregate([
            { $match: { investorInfo: investorId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Active investments by this investor
        const activeInvestments = await Investment.countDocuments({ investorInfo: investorId, investmentStatus: true });

        // Investments per month by this investor
        const totalInvestedPerMonth = await Contract.aggregate([
            { $match: { investorInfo: investorId } },
            {
                $group: {
                    _id: { 
                        month: { $month: '$startDate' }, 
                        year: { $year: '$startDate' } 
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            totalAmount: totalAmount[0] ? totalAmount[0].total : 0,
            activeInvestments,
            totalInvestedPerMonth,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { investorDashboardStates };
