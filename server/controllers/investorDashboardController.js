import Contract from '../models/contractModel.js';
import Investment from '../models/investmentsModel.js';
import mongoose from 'mongoose';


export const getInvestorDashboard = async (req, res) => {
  try {
    const investorId = req.params.investorId;

    const totalAmount = await Contract.aggregate([
      { $match: { investorInfo: new mongoose.Types.ObjectId(req.params.investorId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);


    // Fetch active investments count
    const activeInvestments = await Contract.countDocuments({
      investorInfo: investorId,
      investmentStatus: true,
    });

    // Fetch total invested per month
    const totalInvestedPerMonth = await Contract.aggregate([
      { $match: { investorInfo: new mongoose.Types.ObjectId(req.params.investorId) } },
      {
        $group: {
          _id: { year: { $year: "$startDate" }, month: { $month: "$startDate" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
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
  const investmentsPerTitle = await Investment.aggregate([
    {
        $group: {
            _id: '$titleInv',  
            totalAmount: { $sum: '$amount' }  
        }
    },
    {
        $project: {
            _id: 0,            
            title: '$_id',   
            totalAmount: 1     
        }
    }
]);
    const dashboardStats = {
      totalAmount: totalAmount[0]?.total || 0,
      activeInvestments,
      totalInvestedPerMonth,
      investmentsPerType,
      investmentsPerTitle

    };

    return res.json(dashboardStats);
  } catch (error) {
    console.error('Error fetching investor dashboard:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
