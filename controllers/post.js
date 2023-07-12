const Hashtag = require('../models/hashtag');
const Post = require('../models/post');
const User = require('../models/user');
const db = require('../models');

exports.deletePost = async (req, res, next) => {
    try {
        const user = await User.findOne({where: {id : req.user.user.id}});
        if (user) {
            await Post.destroy({where : { id : req.params.id }});
            res.json("success");
        } else {
            res.status(404).send('no user');
        };   
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.unlikePost = async (req, res, next) => {
    try {
        const user = await User.findOne({where : { id : req.user?.user.id || null}});
        if (user) {
            await user.removeLikeposts(parseInt(req.params.id, 10));
            res.json('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.likePost = async (req, res, next) => {
    try {
        const user = await User.findOne({where : { id : req.user?.user.id || null}});
        if (user) {
            // await user.addPost(parseInt(req.params.id, 10));
            await db.sequelize.models.Like.create({
                UserId : req.user.user.id,
                PostId : req.params.id,
            });
            res.json('success');
        } else {
            res.status(404).send('no user');
        };
    } catch (error) {
        console.error(error);
        next(error);
    };
};

exports.afterUploadImage = (req, res) => {
    console.log("req.file", req.file);
    res.json({ url: `/img/${req.file.filename}`});

}

exports.uploadPost = async (req, res, next) => { // req.body.content, req.body,url
    try {
        const post = await Post.create({
            content: req.body.content,
            img : req.body.url,
            UserId: req.user.user.id,
        });

        const hashtags = req.body.content.match(/#[^\s#]*/g); // 해시태그 추출 정규표현식
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0])); //post-hashtag 다대다 관계가 생성됨

        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}