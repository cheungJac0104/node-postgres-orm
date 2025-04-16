import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const PostLike = sequelize.define('PostLike', {
    like_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'CommunityPost',
        key: 'post_id'
      }
    },
    user_id: {
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
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'user_id'] // Prevent duplicate likes
      }
    ]
  });

  PostLike.initializeAssociations = (models) => {
    PostLike.belongsTo(models.CommunityPost, {
      foreignKey: 'post_id',
      as: 'post',
      onDelete: 'CASCADE'
    });
    
    PostLike.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  export default PostLike;