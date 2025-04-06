import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const AIInteraction = sequelize.define('AIInteraction', {
  interaction_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  tip_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  generated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  user_feedback: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
    allowNull: true,
  },
  feedbackText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feedback_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default AIInteraction;