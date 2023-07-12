const express = require('express');
const { renderLikePost, renderOnly, renderEdit, renderProfile, renderJoin, renderMain, renderHashtag, renderHashtag2 } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const spawn = require('child_process').spawn;


const router = express.Router();

router.use((req, res, next) => { // 다른 라우터들이 공통으로 쓸 수 있는 변수들
  res.locals.user = req.user?.user || null; // 로그인 안했으면 req.user가 null이 됨
  res.locals.followerCount = req.user?.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.user?.Followings?.map(f=> f.id) || [];
  next();
});

//node.js에서 파이썬 실행하는 테스트코드
router.get('/test', (req, res)=>{
  const python = spawn('python',['test.py']);
  python.stdout.on('data', (data)=>{
    console.log('출력결과: '+data);
    res.json(data);
  });
  python.stderr.on('data', (data)=>{
    console.log('에러 메세지:'+data);
  })
});

router.get('/likePost', isLoggedIn, renderLikePost);
router.get('/:id/only', renderOnly);
router.get('/edit', isLoggedIn, renderEdit);
router.get('/profile',isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin); // 회원가입 (로그인 안한사람만 회원가입 가능하게)
router.get('/', renderMain);
router.get('/hashtag', renderHashtag); // hashtag?hashtag=고양이 => req.query.Hashtag
router.get('/:hashtag/hashtag', renderHashtag2);
module.exports = router;