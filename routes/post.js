const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { deletePost, unlikePost, likePost, afterUploadImage, uploadPost } = require('../controllers/post')

try {
    fs.readdirSync('uploads');
} catch {
    fs.mkdirSync('uploads');
}

const upload = multer({ // 이미지 올릴 때
    storage: multer.diskStorage({ // 사용자가 업로드한 사진을 어디에 저장할 것 인지
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            console.log(file)
            const ext = path.extname(file.originalname); // 이미지.png -> 이미지123123123.png (이미지 이름의 중복을 피하기 위해서 시간을 붙여줌)
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024},
});
router.post('/img',isLoggedIn,upload.single('img'), afterUploadImage);
router.post('/:id/like', isLoggedIn, likePost);
router.post('/:id/unlike', isLoggedIn, unlikePost);
router.post('/:id/delete', isLoggedIn, deletePost);

const upload2 = multer(); // 게시글 올릴 때
console.log("****", upload2)
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;