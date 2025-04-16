import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const PrivacySetting = sequelize.define('PrivacySetting', {
  setting_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Each user can have only one privacy setting
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  data_sharing_level: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    allowNull: false,
    defaultValue: 'public'
  },
  encryption_key: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

PrivacySetting.initializeAssociations = (models) => {
  PrivacySetting.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
  });
};

export default PrivacySetting;