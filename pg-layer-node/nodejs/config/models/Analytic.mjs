import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const Analytic = sequelize.define('Analytic', {
  analytics_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  mood_trend: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  challenges_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Analytic;