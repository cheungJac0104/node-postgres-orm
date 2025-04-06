import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const PublicChallenge = sequelize.define('PublicChallenge', {
  public_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  anonymized_user_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  completion_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

export default PublicChallenge;