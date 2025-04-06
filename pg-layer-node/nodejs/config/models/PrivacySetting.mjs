import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const PrivacySetting = sequelize.define('PrivacySetting', {
  setting_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  data_sharing_level: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  encryption_key: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default PrivacySetting;