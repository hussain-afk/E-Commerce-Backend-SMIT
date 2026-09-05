import userSchema from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/auth.token.js"
/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    const { username, email, password, role = "user" } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        const existingUser = await userSchema.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userSchema.create({
            username,
            email,
            role,
            password: hashedPassword
        })
        const token = generateToken(newUser._id, newUser.role)
        // Set the token in a cookie
        res.cookie('token', token,
            // {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none'
            // }
        );
        res.status(201).json({
            message: "User created successfully", user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }, token
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    const { username, password } = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await userSchema.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const token = generateToken(user._id, user.role)
        // Set the token in a cookie
        res.cookie('token', token,
            // {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none'
            // }
        );
        res.status(200).json({
            message: "Login successful", user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }, token
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Admin register user
 * @route POST /api/users/admin-register
 * @access Private (Admin only)
 */
export const addUser = async (req, res) => {
    const { username, email, password, role = "user" } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        const existingUser = await userSchema.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userSchema.create({
            username,
            email,
            role,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Admin login user
 * @route POST /api/users/admin-login
 * @access Private (Admin only)
 */
export const adminLoginUser = async (req, res) => {
    const { username, password } = req.body

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await userSchema.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const token = generateToken(user._id, user.role)
        // Set the token in a cookie
        res.cookie('token', token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }
        );

        const decoded = req.user

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" })
        }

        res.status(200).json({
            message: "Login successful", user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Get user profile
 * @route GET /api/users/profile
 * @access Private (user only)
  */
export const getUserProfile = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const userProfile = await userSchema.findById(user.id)
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" })
        } else {
            res.status(200).json({
                user: {
                    id: userProfile._id,
                    username: userProfile.username,
                    email: userProfile.email,
                    role: userProfile.role
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }


}
/**
 * @desc Update user profile
 * @route Patch /api/users/profile
 * @access Private (user only)
 */
export const updateUserProfile = async (req, res) => {
    const { id } = req.params
    const { username, email, password, role = "user" } = req.body
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admins can change role to admin" })
        }
        if (password && password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedUser = await userSchema.findByIdAndUpdate(id,
            {
                username,
                email,
                role,
                password: hashedPassword
            }, {
            returnDocument: 'after'
        })
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Private (user only)
 */
export const logoutUser = (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(400).json({ message: "No token found" })
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
/**
 * @desc Delete user profile
 * @route DELETE /api/users/profile
 * @access Private(admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" })
        }
        const userToDelete = await userSchema.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" })
        }
        if (userToDelete.role === "admin") {
            return res.status(403).json({ message: "Forbidden: Cannot delete admin user" })
        }
        const deletedUser = await userSchema.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User deleted successfully",
            role: deletedUser.role
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private (Admin only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const user = req.user
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" })
        }
        const users = await userSchema.find() // Exclude password field
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

