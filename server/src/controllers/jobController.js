const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

// POST /jobs
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) { next(err); }
};

// GET /jobs
const getJobs = async (req, res, next) => {
  try {
    const { status = 'Open', type, skill } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (skill) query.skill = skill;
    const jobs = await Job.find(query)
      .populate('postedBy', 'name location avatar')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { next(err); }
};

// GET /jobs/:id
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('postedBy', 'name location avatar');
    if (!job) return res.status(404).json({ message: req.t('jobs.notFound') });
    res.json(job);
  } catch (err) { next(err); }
};

// PUT /jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: req.t('jobs.notFound') });
    res.json(job);
  } catch (err) { next(err); }
};

// DELETE /jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: req.t('jobs.notFound') });
    res.json({ message: req.t('jobs.deleted') });
  } catch (err) { next(err); }
};

// POST /jobs/apply
const applyToJob = async (req, res, next) => {
  try {
    const { jobId, experience, note } = req.body;
    const documentUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const application = await JobApplication.create({
      jobId, applicantId: req.user._id, experience, note, documentUrl,
    });
    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: req.t('jobs.alreadyApplied') });
    next(err);
  }
};

// GET /applications/my
const getMyApplications = async (req, res, next) => {
  try {
    const apps = await JobApplication.find({ applicantId: req.user._id })
      .populate('jobId', 'title company location type wage status')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { next(err); }
};

// GET /applications/job/:jobId  (recruiter view)
const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: req.t('jobs.notFound') });
    const apps = await JobApplication.find({ jobId: req.params.jobId })
      .populate('applicantId', 'name email phone location avatar')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { next(err); }
};

// PATCH /applications/:id/status  (recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const app = await JobApplication.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) { next(err); }
};

module.exports = {
  createJob, getJobs, getJobById, updateJob, deleteJob,
  applyToJob, getMyApplications, getJobApplications, updateApplicationStatus,
};
