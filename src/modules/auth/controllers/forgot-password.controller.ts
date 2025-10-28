

interface userDao {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface Props {
    user: userDao;
    dao: Record<string, any>;
    services: Record<string, any>
    utils: Record<string, any>;
}

export const forgotPasswordController =  async (props: Props)=> {


    try {
// DTO Validations should have been done by the middlewares

// CHECK IF ACCOUNT WITH THAT EMAIL ALREADY EXIST
// if yes then return error wit appripriate message


// hashPassword
// generate verification token using the utils method

// save user with token: if error then retun

// construct verification link

// send verification email with the appropriate method in the service Props


// return ResponseDTO object back to the route
        
    } catch (error) {
        
    }




}