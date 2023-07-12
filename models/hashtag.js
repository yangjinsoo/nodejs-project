const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
    static initiate(sequelize) { // table 정의
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps : true,
            underscored: false,
            paranoid : false,
            modelName : 'Hashtag',
            tableName : 'hashtags',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'

        })
    }

    static associate(db) { // 관계 정의
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashTag'});
    }
}

module.exports = Hashtag;