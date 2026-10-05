import {AppError} from '../../common/error/error.js';

export const  userAlreadyExist = new AppError('User Already Exist.', 409);

export const  userNotVerified = new AppError('User Not Verified.', 403);

export const  userNotExist = new AppError('User Not Exists.', 404);

export const  userAlreadyVerified = new AppError('User Already verified.' , 400);




// class User {
//     userName;
//     email;
//     password;
//     age;

//     constructor(userName,email,password,age){
//         this.userName = userName;
//         this.email = email;
//         this.password = password;
//         this.age = age;
//     }
// }

// class  Customer extends User{
//     phone;
//     age;
//     address;
//     isVerified;
//     isDeleted;

//     constructor(userName, email,password,phone , age, address) {
//         super(userName,email,password);
//         this.phone = phone;
//         this.age = age;
//         this.address = address;
//         this.isVerified = isVerified;
//         this.isDeleted = isDeleted;
//     }
// }

// const user = new User('sagda' , 's@gmail.com' , '12345', 20);
