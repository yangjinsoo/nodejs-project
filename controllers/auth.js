const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const axios = require('axios')

exports.edit = async (req, res, next) => {
    const { nick, password } = req.body; //es2015문법, 구조분해 할당
    try {
        console.log(nick.length);
        console.log(password.length);
        const data = {};

        if (nick.length !== 0) {
            const exUser = await User.findOne({where: {nick}})
            if (exUser) {
                return res.redirect('/edit?error=exist');
            } else {
                data.nick = nick;
            }
        };
        if (password.length !==0) {
            const hash = await bcrypt.hash(password, 12);
            data.password = hash;
        };
        console.log(data);
        console.log(Object.keys(data).length);
        if (Object.keys(data).length !== 0) {
            await User.update(data, {
                    where : { id: req.user.user.id},
                });
        } else {
            return res.redirect('/edit?error=nodata');
        };
        // const exUser = await User.findOne({where: {nick}})
        // if (exUser) {
        //     return res.redirect('/edit?error=exist');
        // } els
        // const hash = await bcrypt.hash(password, 12); //높을수록 보안에 좋음, 그러나 속도가 느려짐
        // await User.update({
        //     nick : nick,
        //     password: hash,
        // }, {
        //     where : { id: req.user.id},
        // });
        return res.redirect('/'); // 메인화면으로 돌아감
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body; //es2015문법, 구조분해 할당
    try {
        const exUser = await User.findOne({where: {email}})
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); //높을수록 보안에 좋음, 그러나 속도가 느려짐
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); // 메인화면으로 돌아감
    } catch (error) {
        console.error(error);
        next(error);
    }
};
// POST /auth/login
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, userdata, info) => { // done이 여기서 호출됨
        if (authError) { // 서버 실패
            console.error(authError);
            return next(authError);
        }
        if (!userdata) { //로직 실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login({user: userdata}, (loginError) => { // 로그인 성공
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            
            return res.redirect('/');
        })
    })(req, res, next); // 미들웨어 확장 패턴
};

exports.logout = async (req, res, next) => {  // {세션쿠키 : 세션아이디 } 연결되어있는 것을 없애는 역할, 브라우저 connect.sid가 남아있어도 로그인이 안됨
    if (req.user.user.provider == 'kakao') { // 카카오 로그인인 경우 노드버드서비스 로그아웃 전에 카카오 자체 로그아웃 진행.
        let logout = await axios.post('https://kapi.kakao.com/v1/user/logout', {}, //logout, unlink
            { headers: {
                'Authorization': `Bearer ${req.user.ACCESSTOKEN}`
            }})
            .then((res) => {
                console.log('카카오 로그아웃 요청 성공');
                console.log(res.status, res.config.url);
            })
            .catch ((error) => {
                console.error(error);
                console.log("지금 여긴가..?");
            });
        // axios.get(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_ID}&logout_redirect_uri="http://localhost:8001/auth/kakao/logout"`);
    };
    console.log(req.session);
    req.logout(() => {
        console.log("로그아웃 성공");
        console.log(req.session);
        // req.session.destroy(function(){req.session;});
        // console.log(req.session);
        console.log(req.user);
        res.redirect('/');
    });
};