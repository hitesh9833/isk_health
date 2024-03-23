module.exports = (sequelize, Sequelize) => {
    const Otp = sequelize.define('otp', {
      email: {
        type: Sequelize.STRING,
        field: "email",
      },
      code: {
        type: Sequelize.STRING,
      },
      expireIn: {
        type: Sequelize.INTEGER,
      },
    }, {
      freezeTableName: true,
      tableName: "otp",
    })
  
    return Otp
  }