import { Router } from "express";
import {uploadSingleFile , uploadFilesArray } from "../../pkg/media/multer.js";
import { fileValidation , allowedFields } from "../../pkg/media/file.validition.js";
import { authGuard } from "../../lib/auth/authGuard.js";
import * as usercontroller from "./controller/user.controller.js";


const userRouter = Router();

userRouter.post('/upload-profile-pic' ,authGuard, uploadSingleFile('pp') ,fileValidation(), usercontroller.uploadProfilePic );

userRouter.post('/upload-cv' , uploadSingleFile('cv', allowedFields.files), fileValidation(allowedFields.files) , async (req, res, next) => {
    res.json('OK')
});

userRouter.post('/upload-cover-images' , uploadFilesArray('cover-image',3) , async (req, res, next) => {
    console.log(req.files);
    res.json('OK')
});

export default userRouter;