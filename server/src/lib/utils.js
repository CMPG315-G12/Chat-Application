import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    //Define a JWT and sign it to the UserID
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    //Send the JWT to the cookies - accesable only by http requests
    res.cookie("JWT", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days to ms
        httpOnly: true, //prevents XSS
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development"
    })

    return token;
}