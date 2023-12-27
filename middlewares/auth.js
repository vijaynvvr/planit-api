const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login'
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized user'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
}
