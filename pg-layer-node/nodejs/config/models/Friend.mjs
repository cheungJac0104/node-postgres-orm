import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const Friend = sequelize.define('Friend', {
  friend_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

export default Friend;