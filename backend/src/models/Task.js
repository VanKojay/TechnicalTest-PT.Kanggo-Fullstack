const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
      len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'in-progress', 'done']],
        msg: 'Status must be one of: pending, in-progress, done',
      },
    },
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
    validate: {
      isDate: { msg: 'Deadline must be a valid date' },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
