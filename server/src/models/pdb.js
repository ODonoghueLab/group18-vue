'use strict'
module.exports = (sequelize, DataTypes) => {
  var pdb = sequelize.define('pdb', {
    element: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    pdb: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    binding_energy: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    binding_energy_20: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'pdb'
  })
  return pdb
}
