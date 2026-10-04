export const  userAlreadyExist = new Error('User Already Exist.');

export const  userNotVerified = new Error('User Not Verified.');

export const  userNotExist = new Error('User Not Exists.');

export const  userAlreadyVerified = new Error('User Already verified.');

class User {
    userName;
    email;
    password;
    age;

    constructor(userName,email,password,age){
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
    }
}

class  Customer extends User{
    phone;
    age;
    address;
    isVerified;
    isDeleted;

    constructor(userName, email,password,phone , age, address) {
        super(userName,email,password);
        this.phone = phone;
        this.age = age;
        this.address = address;
        this.isVerified = isVerified;
        this.isDeleted = isDeleted;
    }
}

const user = new User('sagda' , 's@gmail.com' , '12345', 20);
