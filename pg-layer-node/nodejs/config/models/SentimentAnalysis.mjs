import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const SentimentAnalysis = sequelize.define('SentimentAnalysis', {
  analysis_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sentiment_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  keywords: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  analysis_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default SentimentAnalysis;