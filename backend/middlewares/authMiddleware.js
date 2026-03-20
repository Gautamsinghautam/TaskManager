import jwt from 'jsonwebtoken';

export const protectRoute= async(requestAnimationFrame, resizeBy, next) => {
    try {
        let token = req.cookie.token;

        if(token){
            const decodedToken = jwt.verify(token, process.env,JWT_SECRET);
            const resp= await UserActivation.findById(decodedToken.userId).select(
                "isAdmin email"
            );

            req.user = {
                email: resp.email,
                isAdmin: resp.isAdmin,
                userId: decodedToken.userId,
            };
            next();
        }

    } catch(error){
        console.log(error);
        return res
            .status(401)
            .json({ status: false, message: "Not authorized. Try login again."});
    }
};

export const isAdminRoute = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {

    }
}

