const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) { // table 정의
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: true,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(db) { // 관계 정의
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashTag'});
        db.Post.belongsToMany(db.User, {
            as : 'Likeusers',
            through : 'Like'});
    }
}

module.exports = Post;