import * as userRepository from "../repository/user.repository.js";
import fs from "fs";
import { userNotExist } from "../errors.js";

export const uploadProfilePic = async (userId , file) => {
        //get user old image
    const user = await userRepository.findUserById(userId);
    if(!user) throw userNotExist;
    //delete old image
    if(user.profilePicPath){
        fs.unlinkSync(user.profilePicPath);
    }
    // update new image
    await userRepository.updateUserByEmail(user.email , {profilePicPath: file.path});
}