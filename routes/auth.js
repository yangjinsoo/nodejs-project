const express = require('express');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { edit, join, login, logout } = require('../controllers/auth');
const router = express.Router();

router.post('/edit', isLoggedIn, edit);
// POST /auth/join
router.post('/join', isNotLoggedIn, join);
// POST /auth/login
router.post('/login', isNotLoggedIn, login);
// GET /auth/logout
router.get('/logout', isLoggedIn, logout);



router.get('/kakao', passport.authenticate('kakao')); // /auth/kakao, 카카오톡 로그인 화면으로 redirect
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
  console.log('이게 동작되나?');
  console.log(req.user);
  res.redirect('/');
}); // /auth/kakao
router.get('/kakao/logout', (req, res, next) => {
  console.log('로그아웃 성공');
  res.redirect('/');
});
module.exports = router;