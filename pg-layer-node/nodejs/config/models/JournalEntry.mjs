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
  challenge_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'PublicChallenge',
      key: 'public_id'
    }
  },
  shared_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  shared_with_friend_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  // Track share status
  share_status: {
    type: DataTypes.ENUM('pending', 'accepted'),
    allowNull: true, // Only relevant for shared entries
    defaultValue: 'pending'
  },
  shared_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  responded_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  challenge_progress: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  is_shared_publicly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  indexes: [
    {
      fields: ['challenge_id']
    },
    {
      fields: ['shared_with_friend_id']
    },
    {
      fields: ['share_status'] // For querying by share status
    }
  ]
});

JournalEntry.initializeAssociations = (models) => {
  JournalEntry.belongsTo(models.PublicChallenge, {
    foreignKey: 'challenge_id',
    as: 'challenge',
    onDelete: 'SET NULL'
  });
  
  JournalEntry.belongsTo(models.User, {
    foreignKey: 'shared_with_friend_id',
    as: 'shared_with_friend',
    onDelete: 'SET NULL'
  });

  JournalEntry.belongsTo(models.User, {
    foreignKey: 'shared_by_user_id',
    as: 'shared_by_user',
    onDelete: 'SET NULL'
  });
};

export default JournalEntry;