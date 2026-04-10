const router = require('express').Router();
const {
  createJob, getJobs, getJobById, updateJob, deleteJob,
  applyToJob, getMyApplications, getJobApplications, updateApplicationStatus,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Jobs
router.get('/',     getJobs);
router.get('/:id',  getJobById);
router.post('/',    authMiddleware, roleMiddleware('recruiter', 'buyer', 'admin'), createJob);
router.put('/:id',  authMiddleware, roleMiddleware('recruiter', 'buyer', 'admin'), updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('recruiter', 'buyer', 'admin'), deleteJob);

// Applications
router.post('/apply',                         authMiddleware, roleMiddleware('farmer'), upload.single('document'), applyToJob);
router.get('/applications/my',                authMiddleware, getMyApplications);
router.get('/applications/job/:jobId',        authMiddleware, roleMiddleware('recruiter', 'buyer', 'admin'), getJobApplications);
router.patch('/applications/:id/status',      authMiddleware, roleMiddleware('recruiter', 'buyer', 'admin'), updateApplicationStatus);

module.exports = router;
