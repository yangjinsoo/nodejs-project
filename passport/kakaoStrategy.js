const passport = require("passport");
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = (req, res, next) => {
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback',
    }, async ( accessToken, refreshToken, profile, done) => {
        console.log('profile', profile); // 사용자 정보가 계속 바뀜, profile이 어떤 모양을 가지고 있는지 확인 필요
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}
            });
            if (exUser) {
                done(null, {user : exUser,
                            ACCESSTOKEN : accessToken});
            } else { // 회원가입 시킴
                const newUser = await User.create({
                    email : profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                })
                done(null, {user : newUser,
                            ACCESSTOKEN : accessToken});
            };
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};