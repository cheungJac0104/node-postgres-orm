import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const Analytic = sequelize.define('Analytic', {
  analytics_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  // Raw metrics for score calculation
  user_challenges_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  public_challenges_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  post_likes_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  journal_invites_sent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  journal_invites_accepted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Now stored in database
  engagement_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeSave: async (analytic) => {
      // Recalculate engagement score before saving
      analytic.calculateEngagementScore();
      analytic.last_updated = new Date();
    },
    beforeUpdate: async (analytic) => {
      // Also recalculate on update
      analytic.calculateEngagementScore();
      analytic.last_updated = new Date();
    }
  }
});

// Add instance method to calculate score
Analytic.prototype.calculateEngagementScore = function() {
  const weights = {
    userChallenge: 0.05,    // 5%
    publicChallenge: 0.15,  // 15%
    postLikes: 0.30,        // 30%
    invitesSent: 0.20,      // 20%
    invitesAccepted: 0.30    // 30%
  };
  
  this.engagement_score = Math.min(100, 
    (this.user_challenges_completed * weights.userChallenge) +
    (this.public_challenges_completed * weights.publicChallenge) +
    (this.post_likes_received * weights.postLikes) +
    (this.journal_invites_sent * weights.invitesSent) +
    (this.journal_invites_accepted * weights.invitesAccepted)
  );
};

// Update method to recalculate metrics
Analytic.prototype.updateEngagementMetrics = async function() {
  const user = await this.getUser();
  
  const [
    userChallenges,
    publicChallenges,
    postLikes,
    invitesSent,
    invitesAccepted
  ] = await Promise.all([
    user.countUserChallenges(),
    user.countPublicChallenges(),
    user.countPostLikes(),
    user.countJournalInvitesSent(),
    user.countJournalInvitesAccepted()
  ]);
  
  // Update the metrics
  this.user_challenges_completed = userChallenges;
  this.public_challenges_completed = publicChallenges;
  this.post_likes_received = postLikes;
  this.journal_invites_sent = invitesSent;
  this.journal_invites_accepted = invitesAccepted;
  
  // Recalculate the score
  this.calculateEngagementScore();
  
  // Save all changes
  await this.save();
};

Analytic.associate = (models) => {
  Analytic.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });
};

export default Analytic;