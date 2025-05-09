const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists)
      return res.json({ code: 400, data: null, message: "User already exists" })

    const user = await User.create({ name, email, password })
    res.json({
      code: 200,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      },
      message: "success",
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        code: 200,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        },
        message: "success",
      })
    } else {
      res.json({ code: 401, data: null, message: "Invalid email or password" })
    }
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.json({ code: 404, data: null, message: "User not found" })
    }

    res.json({
      code: 200,
      data: {
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
      },
    })
  } catch (error) {
    res.json({
      code: 500,
      data: null,
      message: "Server error",
      error: error.message,
    })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user)
      return res.json({ code: 404, data: null, message: "User not found" })

    const { name, email, currentPassword, newPassword } = req.body

    user.name = name || user.name
    user.email = email || user.email

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.json({
          code: 401,
          data: null,
          message: "Current password incorrect. Please try again.",
        })
      }
      user.password = await bcrypt.hash(newPassword, 10)
    } else if (currentPassword || newPassword) {
      return res.json({
        code: 400,
        data: null,
        message: "Both current and new password are required to change password.",
      })
    }

    const updatedUser = await user.save()

    res.json({
      code: 200,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser.id),
      },
      message: "Profile updated successfully.",
    })
  } catch (error) {
    res.json({ code: 500, data: null, message: error.message })
  }
}

module.exports = { registerUser, loginUser, updateUserProfile, getProfile }
