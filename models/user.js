const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) { // table 정의
        User.init({
            email: {
                type : Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type : Sequelize.STRING(100),
                allowNull: true
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'), //local 또는 kakao로만 로그인이 되도록 제한해줌(eamil로 로그인 한 사람과 kakao 로그인 한 사람 구분)
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt - True면 해당 형태로 
            underscored: false, // created_at, updated_at
            modelName: 'User',
            tableName: 'users',
            paranoid: true, //deletedAt, 유저삭제일 // soft delete
            charset: 'utf8', //mb4: 이모티콘 저장가능
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) { // 관계 정의
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // follower
            foreignKey: 'followingId',
            as : 'Followers',
            through : 'Follow'
        });
        db.User.belongsToMany(db.User, { // following
            foreignKey: 'followerId',
            as : 'Followings',
            through : 'Follow'
        });
        db.User.belongsToMany(db.Post, { 
            as : 'Likeposts',
            through : 'Like'});
        
    }
}

module.exports = User;