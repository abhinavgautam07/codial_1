const express=require('express');
const router=express.Router();
const likesController=require('../controllers/likes_controller');
const passport=require('passport');
router.get('/toggle',passport.checkAuthentication,likesController.toggleLike);

module.exports=router;