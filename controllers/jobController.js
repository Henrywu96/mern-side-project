import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors/index.js";
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

const createJob = async (req, res) => {
    const { position, company } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Please provide all values!');
    }

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
    const { status, jobType, sort, search } = req.query;

    const queryObject = { createdBy: req.user.userId };

    // if status is not equal to All
    if (status && status !== 'All') {
        queryObject.status = status;
    }

    // if job type is not equal to All
    if (jobType && jobType !== 'All') {
        queryObject.jobType = jobType;
    }

    // if search exists
    if (search) {
        queryObject.position = {$regex: search, $options: 'i'};
    }

    // no await
    let result = Job.find(queryObject);

    // chain sort conditions
    if (sort === 'Latest') {
        result = result.sort('-createdAt');
    }
    if (sort === 'Oldest') {
        result = result.sort('createdAt');
    }
    if (sort === 'A-Z') {
        result = result.sort('position');
    }
    if (sort === 'Z-A') {
        result = result.sort('-position');
    }

    // search results, limit & skip pages
    const page = Number(req.query.page) || 1; // if nothing's there, by default will be the first page
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    // await the result and count the query object
    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);

    // number of pages shown based on search results
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages: numOfPages });
};

const updateJob = async (req, res) => {
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Please provide all values!');
    }

    // get the job whose id matches the jobId
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    // check permissions
    // job.createdBy = resourceUserId
    checkPermissions(req.user, job.createdBy);


    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true
    });

    res.status(StatusCodes.OK).json({ updatedJob });


    // Alternative way, make sure the property exists
    // job.position = position;
    // job.company = company;
    // await job.save();
    // res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy);

    // remove the job
    await job.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // get accumulate stats count
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});

    // default stats
    const defaultStats = {
        Pending: stats.Pending || 0,
        Interview: stats.Interview || 0,
        Declined: stats.Declined || 0
    }
    let monthlyApplications = await Job.aggregate([
        {
            $match: {
                createdBy: mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': -1, '_id.month': -1 }
        },
        {
            $limit: 6
        }
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item;

        // create date using moment
        const date = moment().month(month - 1).year(year).format('MMM Y');

        return { date, count };
    }).reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, getAllJobs, updateJob, deleteJob, showStats };
