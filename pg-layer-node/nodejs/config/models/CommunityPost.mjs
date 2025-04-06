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
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

export default CommunityPost;