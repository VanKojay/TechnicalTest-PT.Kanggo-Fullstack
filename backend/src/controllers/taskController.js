const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Task } = require('../models');

/**
 * @desc    Get all tasks for the authenticated user with filter, search, and pagination
 * @route   GET /api/tasks
 * @access  Private
 */
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build where clause
    const where = { userId };

    // Filter by status
    if (status && ['pending', 'in-progress', 'done'].includes(status)) {
      where.status = status;
    }

    // Search by title
    if (search && search.trim()) {
      where.title = { [Op.like]: `%${search.trim()}%` };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    const totalPages = Math.ceil(count / limitNum);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: count,
          itemsPerPage: limitNum,
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { title, description, status, deadline } = req.body;
    const userId = req.user.id;

    const task = await Task.create({
      title,
      description: description || null,
      status: status || 'pending',
      deadline: deadline || null,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Find task and check ownership
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update fields
    const { title, description, status, deadline } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find task and check ownership
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
