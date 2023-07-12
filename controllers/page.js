const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const db = require('../models');

exports.renderLikePost = async (req, res, next) => {
  try {
    // const user = await User.findOne({
    //   where : { id : req.user.id},
    //   include : [{
    //     model : Post,
    //     include: [
    //       {
    //         model: User,
    //         attributes: ['id', 'nick'],
    //       },
    //       {
    //         model: User,
    //         attributes : ['id'],
    //         as : 'Likeusers',
    //       }
    //     ],
    //     order: [['createdAt', 'DESC']],
    //     as : 'Likeposts',
    //   }]
    // });
    const user = await User.findOne({where : { id : req.user?.user.id }});
    let posts = [];
    if (user){
      posts = await user.getLikeposts({
        include: [
          {
            model: User,
            attributes: ['id', 'nick'],
          },
          {
            model: User,
            attributes : ['id'],
            as : 'Likeusers',
          }
        ],
        order : [['createdAt', 'DESC']]
      });
    } else {
      return res.redirect('/?error=exist');
    };
    if (posts.length == 0) {
      return res.redirect('/?error=noexist');
    };
    res.render('main', {
      title: 'NodeBird - LikePosts',
      twits: posts,
      likelist: req.user?.user.Likeposts?.map(f=> f.id) || [],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.renderOnly = async (req, res, next) => {
  try {
    console.log(req.params.id);
    req.session.test='test';
    const posts = await Post.findAll({
      where : { userId : req.params.id},
      include: [
        {
          model: User,
          attributes: ['id', 'nick'],
        },
        {
          model: User,
          attributes : ['id'],
          as : 'Likeusers',
        }
      ],
      order: [['createdAt', 'DESC']],
    }); 
    console.log(posts.length);
    
    res.render('main', {
      title: 'NodeBird - Only',
      twits: posts,
      likelist: req.user?.user.Likeposts?.map(f=> f.id) || [],
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderEdit = (req, res) => {
  res.render('edit', { title : '회원정보 수정 - NodeBird'});
};

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
  };
  
exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' }); //join.html
};
  
exports.renderMain = async(req, res, next) => {
  try {
    console.log(req.session);
    // console.log(req.session.passport);
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'nick'],
        },
        {
          model: User,
          attributes : ['id'],
          as : 'Likeusers',
        },
        {
          model: Hashtag,
          attributes : ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    }); 

    res.render('main', {
      title: 'NodeBird',
      twits: posts,
      likelist: req.user?.user?.Likeposts?.map(f=> f.id) || [],
    });
  } catch (error) {
      console.error(error);
  }
};

exports.renderHashtag = async(req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where : {title:query}});
    let posts = [];
    if (hashtag){
      posts = await hashtag.getPosts({
        include: [
          {
            model: User,
            attributes: ['id', 'nick'],
          },
          {
            model: User,
            attributes : ['id'],
            as : 'Likeusers',
          }
        ],
        order : [['createdAt', 'DESC']]
      });
    } else {
      return res.redirect('/?error=exist');
    }
    res.render('main', {
      title: `${query} | NodeBird_hashtag`,
      twits: posts,
      likelist: req.user?.user?.Likeposts?.map(f=> f.id) || [],
    })
  } catch (error) {
      console.error(error);
      next(error);
  }
};

exports.renderHashtag2 = async(req, res, next) => {
  const query = req.params.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where : {title:query}});
    let posts = [];
    if (hashtag){
      posts = await hashtag.getPosts({
        include: [
          {
            model: User,
            attributes: ['id', 'nick'],
          },
          {
            model: User,
            attributes : ['id'],
            as : 'Likeusers',
          }
        ],
        order : [['createdAt', 'DESC']]
      });
    } else {
      return res.redirect('/?error=exist');
    }
    res.render('main', {
      title: `${query} | NodeBird_hashtag`,
      twits: posts,
      likelist: req.user?.user?.Likeposts?.map(f=> f.id) || [],
    })
  } catch (error) {
      console.error(error);
      next(error);
  }
}

// controller는 서비스를 호출함
// 라우터는 controller를 호출함
// 서비스 : 요청, 응답을 모름
// 라우처 -> 컨트롤러 -> 서비스
