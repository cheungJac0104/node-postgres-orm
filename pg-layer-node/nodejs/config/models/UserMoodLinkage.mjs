import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const UserMoodLinkage = sequelize.define('UserMoodLinkage', {
    linkage_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User', // Your existing User table
        key: 'user_id'
      }
    },
    mood_entry_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'MoodEntry', // Your MoodEntry table
        key: 'mood_id'
      }
    },
    triggered_tip_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'AIInteraction', 
        key: 'interaction_id'
      }
    },
    sentiment_analysis_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'SentimentAnalysis', // Your SentimentAnalysis table
        key: 'analysis_id'
      }
    },
    recorded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'mood_entry_id'] // Prevent duplicate entries
      }
    ],
    hooks: {
      beforeValidate: (instance) => {
          // Ensure all required foreign keys are present
          if (!instance.user_id || !instance.mood_entry_id || 
              !instance.triggered_tip_id || !instance.sentiment_analysis_id) {
              throw new Error('All reference fields are required');
          }
      }
  }
  });

  // Initialize associations
UserMoodLinkage.initializeAssociations = (models) => {
  UserMoodLinkage.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });
  
  UserMoodLinkage.belongsTo(models.MoodEntry, {
      foreignKey: 'mood_entry_id',
      as: 'mood_entry',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });
  
  UserMoodLinkage.belongsTo(models.AIInteraction, {
      foreignKey: 'triggered_tip_id',
      as: 'triggered_tip',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });
  
  UserMoodLinkage.belongsTo(models.SentimentAnalysis, {
      foreignKey: 'sentiment_analysis_id',
      as: 'sentiment_analysis',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });
};

  export default UserMoodLinkage;