// statsController.js
const Property = require('../models/property'); // ✅ Correct model
const Agent = require('../models/agent');       // ✅ Agent model
const Booking = require('../models/booking');   // ✅ Booking model
const User = require('../models/user');

exports.getStats = async (req, res) => {
    try {
        const totalProperties = await Property.countDocuments();
        const totalAgents = await Agent.countDocuments();
        const totalBookings = await Booking.countDocuments({ status: 'pending' });
        const totalApprovedBookings = await Booking.countDocuments({ status: 'approved' });

        return res.status(200).json({
            totalProperties,
            totalAgents,
            totalBookings,
            totalApprovedBookings,
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return res.status(500).json({ message: 'Failed to get stats', error: error.message });
    }
};
exports.getInvestorStats = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Investor ID is required' });
    }

    // Find investor and populate their properties
    const investor = await User.findById(id).populate('properties');

    if (!investor || investor.role !== 'investor') {
      return res.status(404).json({ message: 'Investor not found or invalid role' });
    }

    const properties = investor?.properties || [];

    const totalProperties = properties.length;

    const totalVisitCount = properties.reduce((sum, prop) => {
      return sum + (prop.visitCount || 0);
    }, 0);

    return res.status(200).json({
      investor: investor.name,
      totalProperties,
      totalVisitCount
    });
  } catch (error) {
    console.error('Investor Stats Error:', error);
    return res.status(500).json({
      message: 'Failed to get investor stats',
      error: error.message
    });
  }
};


