import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

// user generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error(500, "something went wrong while generating access and refresh token")
    }
}

// user registration method
const registerUser = asyncHandler(async (req, res) => {

    // get the user data from frontend
    // if the user is not existing then create a new one
    // upload the file in server then cloudinary
    // input validates
    // remove password and refresh token fields from response
    // check for user creation
    // return response

    const { fullName, email, userName, password } = req.body
    if (
        [fullName, email, userName, password].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    // check if the user already exists
    const userExist = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (userExist) {
        throw new ApiError(409, "user name or email already exists!")
    }

    /*
    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required!")
    }

    #Image uploading and getting url
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required!")
    }
*/
    // create object to send the data into database
    const user = await User.create({
        fullName,
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById({ _id: user._id }).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});

// user login method
const loginUser = asyncHandler(async (req, res) => {

    // get input data from user
    // match the input password
    // generate token and refresh token
    // store the data,token into cookie
    // validate the input data

    const { email, userName, password } = req.body

    if ((!email || !userName) && !password) {
        throw new ApiError(400, "userName or email and password is required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (!user) {
        throw new ApiError(500, "User does not exist!");
    }
    // password validation
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(500, "Incorrect password!");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged in successfully")
        );

});

// logOut user method
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: { refreshToken: 1 } //used - set to unset
        },
        { new: true },
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200,
                {},
                "User Logged Out successfully")
        )

})

// re-login user with refresh token
const incomingRefreshToken = asyncHandler(async (req, res) => {

    // console.log(req.body.refreshToken);


    const incomingRefreshToken = req.body?.refreshToken || req.cookie?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized refresh token!")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        console.log(decodedToken?._id);
        const user = await User.findOne({ _id: decodedToken?._id })

        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Your refresh token has expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = newRefreshToken;

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, "refreshToken": newRefreshToken },
                "token refreshed successfully!"
            ))
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }

})

// change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // console.log(req.body);

    // if (newPassword !== confirmPassword) {
    //     throw new ApiError(401, "password should be matches with confirm password");
    // }

    if (!oldPassword || !newPassword) {
        throw new ApiError(401, "old password and new password should not be empty or equal");
    }

    const response = await User.find(req.user?._id)
    // console.log(user[0].password);
    const user = response[0];
    const isCorrectPassword = await user.isPasswordCorrect(oldPassword)

    if (!isCorrectPassword) {
        throw new ApiError(401, "Invalid old password")
    }

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password updated successfully"))
})

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

//get current user
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, users, "all users fetched successfully"))
})

//update user account
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, userName, email } = req.body
    // console.log(req.body);
    if (!email || !fullName || !userName) {
        throw new ApiError(400, "Invalid email UserName and fullName")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        // req.body,
        {
            $set: { email: email, fullName: fullName, userName: userName }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "account Updated successfully"))
})

// update avatar image 
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "while uploading avatar file")
    }

    const updatedAvatar = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedAvatar, "avatar updated successfully"))

})

// update cover image 
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "while uploading avatar file")
    }

    const updatedCoverImage = await User.findByIdAndUpdate(
        req.user?._id,
        { coverImage: coverImage.url },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedCoverImage, "Cover image updated successfully")
        )

})

// Delete user account
const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user?._id)
    if (!user) {
        throw new ApiError(400, "user not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "account deleted successfully"))
})

// Delete user account
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
        throw new ApiError(400, "user not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"))
})


export { registerUser, loginUser, logOutUser, incomingRefreshToken, changeCurrentPassword, getAllUsers, getCurrentUser, updateUserAvatar, updateCoverImage, updateAccountDetails, deleteAccount, deleteUser };