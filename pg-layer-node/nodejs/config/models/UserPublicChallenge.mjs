import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const UserPublicChallenge = sequelize.define('UserPublicChallenge', {
  participation_id: {
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
  public_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'PublicChallenge',
      key: 'public_id'
    }
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // You could add additional fields like completion status if needed
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'public_id']
    }
  ]
});

UserPublicChallenge.initializeAssociations = (models) => {
    UserPublicChallenge.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    
    UserPublicChallenge.belongsTo(models.PublicChallenge, {
      foreignKey: 'public_id',
      as: 'public_challenge',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  
  export default UserPublicChallenge;