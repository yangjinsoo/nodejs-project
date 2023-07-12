const User = require('../models/user');
const db = require('../models');

exports.follow = async(req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where : {id: req.user?.user.id || null}});
        if (user) {
            await user.addFollowings(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollowing = async(req, res, next) => {
    try {
        // 첫번째 방법 -> 관계 이용해서 명령어 사용하여 데이터 삭제
        // const user = await User.findOne({ where : {id: req.user.id}});
        // if (user) {
        //     await user.removeFollowings(parseInt(req.params.id, 10));
        //     res.send('success');
        // } else {
        //     res.status(404).send('no user');
        // }

        // 두번째 방법 -> 생성된 관계테이블에 직접 접근하여 데이터 삭제
        const model = await db.sequelize.models.Follow;
        try {
            await model.destroy({ where : {
                followingId : req.params.id,
                followerId : req.user.user.id,
            }});
            res.send('success');
        } catch (error) {
            console.error(error);
            res.status(404).send('no data');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollower = async(req, res, next) => {
    try {
        const user = await User.findOne({ where : {id: req.user.user.id}});
        if (user) {
            await user.removeFollowers(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};