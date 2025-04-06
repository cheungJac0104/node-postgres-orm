import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const UserChallenge = sequelize.define('UserChallenge', {
  user_challenge_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  completion_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

export default UserChallenge;