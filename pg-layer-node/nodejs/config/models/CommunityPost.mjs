import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const CommunityPost = sequelize.define('CommunityPost', {
  post_id: {
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
  privacy_mode: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    allowNull: false,
    defaultValue: 'public'
  },
  like_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Reference to the user who created the post
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'user_id'
    }
  }
}, {
  indexes: [
    {
      fields: ['user_id'] // For faster querying by author
    },
    {
      fields: ['created_at'] // For sorting by date
    }
  ]
});

CommunityPost.initializeAssociations = (models) => {
  CommunityPost.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'author',
    onDelete: 'CASCADE'
  });
  
  CommunityPost.hasMany(models.PostLike, {
    foreignKey: 'post_id',
    as: 'likes',
    onDelete: 'CASCADE'
  });
  
  CommunityPost.belongsToMany(models.User, {
    through: models.PostLike,
    foreignKey: 'post_id',
    otherKey: 'user_id',
    as: 'liked_by_users'
  });
};

export default CommunityPost;