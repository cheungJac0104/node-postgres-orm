import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const UserChallenge = sequelize.define('UserChallenge', {
  user_challenge_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  challenge_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'challenge_date'],
      unique: true // One challenge per user per day
    }
  ]
});

// Simple association setup
UserChallenge.associate = (models) => {
  UserChallenge.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });
};

export default UserChallenge;