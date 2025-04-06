import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const MoodEntry = sequelize.define('MoodEntry', {
  mood_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  mood_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  sentiment_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

export default MoodEntry;