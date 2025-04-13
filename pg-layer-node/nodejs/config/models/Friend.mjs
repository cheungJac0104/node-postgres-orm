import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const Friend = sequelize.define('Friend', {
  friendship_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
    allowNull: false,
    defaultValue: 'pending'
  },
  // User who initiated the request
  requester_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  // User who received the request
  addressee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['requester_id', 'addressee_id'] // Prevent duplicate friendships
    },
    {
      fields: ['status'] // For querying by status
    }
  ],
  hooks: {
    beforeUpdate: (friend) => {
      friend.updated_at = new Date();
    }
  }
});

Friend.initializeAssociations = (models) => {
  Friend.belongsTo(models.User, {
    foreignKey: 'requester_id',
    as: 'requester',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Friend.belongsTo(models.User, {
    foreignKey: 'addressee_id',
    as: 'addressee',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  // Add associations to User model
  models.User.hasMany(models.Friend, {
    foreignKey: 'requester_id',
    as: 'sent_friend_requests',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  models.User.hasMany(models.Friend, {
    foreignKey: 'addressee_id',
    as: 'received_friend_requests',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  // For getting all friends regardless of request direction
  models.User.belongsToMany(models.User, {
    through: models.Friend,
    as: 'friends',
    foreignKey: 'requester_id',
    otherKey: 'addressee_id',
    scope: {
      status: 'accepted'
    }
  });
};

export default Friend;