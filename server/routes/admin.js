const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getRecentActivity,
  updateUserStatus,
  getAllCompanies,
  createCompany,
  updateCompanyStatus,
  updateJobModeration,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  broadcastNotification,
  updateCompany,
  deleteCompany,
  addCompanyHR
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);
  
router.route('/users/:id/status')
  .put(updateUserStatus);

router.route('/companies')
  .get(getAllCompanies)
  .post(createCompany);

router.route('/companies/:id')
  .put(updateCompany)
  .delete(deleteCompany);

router.route('/companies/:id/hr')
  .post(addCompanyHR);

router.route('/companies/:id/status')
  .put(updateCompanyStatus);

router.route('/jobs')
  .get(getAllJobs);

router.route('/jobs/:id')
  .delete(deleteJob);
  
router.route('/jobs/:id/moderate')
  .put(updateJobModeration);

router.route('/categories')
  .get(getAllCategories)
  .post(createCategory);

router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

router.post('/notifications/broadcast', broadcastNotification);

module.exports = router;
