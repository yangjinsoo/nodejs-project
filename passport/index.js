// const passport = require('passport');
// const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
// const User = require('../models/user');

// module.exports = () => {
//     passport.serializeUser((user, done) => { // user === exUser
//         done(null, user.id); // user id만 추출
//     });
//     // session { 12~~~ : 1}     {세션쿠기 : 유저아이디}->메모리에 저장됨

//     passport.deserializeUser((id, done) => {
//         User.findOne({where: {id}}) // id로부터 유저 정보를 복원시킴
//             .then((user) => done(null, user)) // 복원된 정보가 req.user가 됨 -> 로그인 안하면 req.user가 null임
//             .catch(err => done(err));
//     });

//     local();
// };

const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const Post = require('../models/post');
const { follow } = require('../controllers/user');

module.exports = (req) => {
    //로그인 시에만 실행
    //로그인하면서 세션에 저장될 데이터들 정함
    passport.serializeUser((data, done) => {
        console.log(data);
        if (data.user.provider == 'kakao') {
            console.log('얘 실행되는거 맞아?');
            done(null, {id : data.user.id,  //user.id만 추출
                        ACCESSTOKEN : data.ACCESSTOKEN}); //세션에 저장할 데이터들
        } else {
            done(null, {id : data.user.id}); //user.id만 추출
        }
    });  // 세션 {세션쿠키 : 사용자id} 메모리에 저장됨.
    
    // 매 요청시 마다 실행
    // 세션에 저장한 데이터를 인자로 받아서 사용가능
    // serializeUser에서 저장한 걸 req.session 객체로 만들어줌
    passport.deserializeUser( async (data, done) => {
        try {
            const loginUser = await User.findOne({ 
                where: { id : data.id },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'nick'],
                        as :'Followers', // 팔로잉
                    },
                    {
                        model: User,
                        attributes: ['id', 'nick'],
                        as :'Followings', // 팔로워
                    },
                    {
                        model: Post,
                        attributes: ['id'],
                        as : 'Likeposts',
                    }
                ]
            });
            if (loginUser.provider == "kakao") {
                done(null, {user : loginUser, ACCESSTOKEN : data.ACCESSTOKEN});
            } else {
                done(null, {user : loginUser})
            };
            
        } catch (error) {
            done(error);
        };
    });

    local();
    kakao();
};