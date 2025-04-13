import { DataTypes } from 'sequelize';
import sequelize from '../database.mjs';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  salt: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  encrypted_password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.initializeAssociations = (models) => {
  
  User.hasOne(models.PrivacySetting, {
    foreignKey: 'user_id',
    as: 'privacy_settings',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  User.hasOne(models.Analytic, { foreignKey: 'user_id' });
  
  // Add these for the metric calculations
  User.hasMany(models.UserChallenge, { 
    as: 'userChallenges',
    foreignKey: 'user_id'
  });
  
  User.hasMany(models.UserPublicChallenge, {
    as: 'userPublicChallenges',
    foreignKey: 'user_id'
  });

  User.hasMany(models.PostLike,{
    as: 'postLikes',
    foreignKey: 'user_id'
  });

  User.hasMany(models.JournalEntry, {
    as: 'journalEntries',
    foreignKey: 'user_id'
  });
  
  // Add similar associations for posts, journals, etc.
};

User.prototype.countPostLikes = function() {
  return this.sequelize.models.PostLike.count({
    where: { 
      user_id: this.user_id
    }
  });
};

User.prototype.countUserChallenges = function() {
  return this.sequelize.models.UserChallenge.count({
    where: { 
      user_id: this.user_id,
      is_completed: true
    }
  });
};

User.prototype.countPublicChallenges = function() {
  return this.sequelize.models.UserPublicChallenge.count({
    where: { 
      user_id: this.user_id,
      status: 'completed'
    }
  });
};

User.prototype.countJournalInvitesSent = function() {
  return this.sequelize.models.JournalEntry.count({
    where: { 
      shared_by_user_id: this.user_id
    }
  });
};

User.prototype.countJournalInvitesAccepted = function() {
  return this.sequelize.models.JournalEntry.count({
    where: { 
      shared_with_friend_id: this.user_id,
      status: 'accepted'
    }
  });
};

export default User;