import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const JournalEntry = sequelize.define('JournalEntry', {
  entry_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_encrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default JournalEntry;