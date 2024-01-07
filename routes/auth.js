const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {auth} = require('../middlewares/auth')

require('dotenv').config();

router.post("/signup", async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({name, email, password: hashedPassword});
        
        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered'
        })
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not registered'
            })
        }
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                visibility: user.visibility
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'}); // 30 days expiry
            const options = {
                expires: new Date(Date.now() + 28*24*60*60*1000), // 28 days expiry
                secure: process.env.NODE_ENV === "development" ? false : true,
                httpOnly: process.env.NODE_ENV === "development" ? false : true,
                sameSite: process.env.NODE_ENV === "development" ? false : "none",
            }
            res.cookie('token', token, options).status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    visibility: user.visibility
                },
                message: 'User logged in successfully'
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: 'Password mismatch'
            })
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        })
    }
});

router.get("/logout",async (req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")
    }
    catch(err){
        res.status(500).json(err)
    }
});

router.get("/fetchUser", auth, async (req, res) => {
    let user = await User.findById(req.user.id);
    req.user.visibility = user.visibility;
    
    res.status(200).json({
        success: true,
        message: 'User logged in',
        data: req.user
    });
});

router.get("/fetchUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        res.status(200).json({
            success: true,
            data: user,
            message: 'User data for given id has been fetched successfully'
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        })
    }
});

router.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find({visibility: true});
        res.status(200).json({
            success: true,
            data: users,
            message: 'Entire user list has been fetched successfully'
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        })
    }
});
    
router.get("/getUsers/:id", async (req, res) => {
    try {
        const query = req.params.id;
        const users = await User.find({ name: { $regex: `^${query}`, $options: 'i' }, visibility: true });
        res.status(200).json({
            success: true,
            data: users,
            message: 'List of a users for given query have been fetched successfully'
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: err.message
        })
    }
});

router.put("/updateVisibility/:email", auth, async (req, res) => {
	try {
		const { email } = req.params;
        const {status} = req.body;
		const user = await User.findOne({email: email});
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		user.visibility = status;
		await user.save();

		res.status(200).json({
			success: true,
			data: user,
			message: "User visibility changed successfully",
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
			message: error.message,
		});
	}
});


module.exports = router;