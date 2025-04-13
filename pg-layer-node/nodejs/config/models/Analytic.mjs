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
  // Computed engagement score
  engagement_score: {
    type: DataTypes.VIRTUAL, // Not stored in DB
    get() {
      const weights = {
        userChallenge: 0.05,    // 5%
        publicChallenge: 0.15,  // 15%
        postLikes: 0.30,        // 30%
        invitesSent: 0.20,      // 20%
        invitesAccepted: 0.30    // 30%
      };
      
      return Math.min(100, 
        (this.user_challenges_completed * weights.userChallenge) +
        (this.public_challenges_completed * weights.publicChallenge) +
        (this.post_likes_received * weights.postLikes) +
        (this.journal_invites_sent * weights.invitesSent) +
        (this.journal_invites_accepted * weights.invitesAccepted)
      );
    }
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeUpdate: (analytic) => {
      analytic.last_updated = new Date();
    }
  },
  instanceMethods: {
    async updateEngagementMetrics() {
      // Count all the relevant metrics
      const [
        userChallenges,
        publicChallenges,
        postLikes,
        invitesSent,
        invitesAccepted
      ] = await Promise.all([
        this.getUser().then(user => user.countUserChallenges()),
        this.getUser().then(user => user.countPublicChallenges()),
        this.getUser().then(user => user.countPostLikes()),
        this.getUser().then(user => user.countJournalInvitesSent()),
        this.getUser().then(user => user.countJournalInvitesAccepted())
      ]);
      
      // Update the metrics
      this.update({
        user_challenges_completed: userChallenges,
        public_challenges_completed: publicChallenges,
        post_likes_received: postLikes,
        journal_invites_sent: invitesSent,
        journal_invites_accepted: invitesAccepted
      });
    }
  }
});

Analytic.associate = (models) => {
  Analytic.belongsTo(models.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });
};

export default Analytic;