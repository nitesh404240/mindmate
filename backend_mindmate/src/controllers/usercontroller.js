import { User } from "../models/UserModel/usermodel.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { uploadOncloudinary } from "../utils/cloudinaryconnect.js";
import jwt from "jsonwebtoken";
const generate_token = async (id) => {
  console.log(id);
  try {
    const user = await User.findById(id);
    // console.log(user)
    if (!user) {
      throw new ApiError(404, "user not exist or wrong call");
    }
    const accessToken = await user.generateAccessToken();
    // console.log(accessToken)
    const refreshToken = await user.refreshtokengenerate();
    //console.log(refreshToken,accessToken)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(404, "something went wrong while generating the tokens");
  }
};
 const checkAuth = async (req, res, next) => {
  try {
    //console.log(req.cookies)
    const getaccesstoken =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    //console.log(getaccesstoken)
    if (!getaccesstoken) {
      throw new ApiError(400, "No access token");
    }
    const decodeuser = await jwt.verify(
      getaccesstoken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodeuser?._id).select(
      "-Password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "invalid access token");
    }
    
    return res.status(200).json( new APIResponse(200,"user checks successfully",user))
    
  } catch (error) {
    throw new ApiError(401, error?.message || "internal error");
  }
};

const loginuser = asynchandler(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || Email.trim() === "") {
    console.log("Email is missing");
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim() === "") {
    console.log("Password is missing");
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ Email });
  if (!user) {
    console.log("user not exist");
    throw new ApiError(400, "user not exists or wrong email");
  }
  console.log(user);
  const passwordMatch = user.isPasswordcorrect(password);
  console.log("checking for passowrd", passwordMatch);
  if (!passwordMatch) {
    throw new ApiError(400, "password is wrong");
  }

  const { accessToken, refreshToken } = await generate_token(user._id);

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in Successfully"
      )
    );
});

const registeruser = asynchandler(async (req, res) => {
  console.log("Register request received");

  const { Username, Email, password, Avatar } = req.body;

  if (!Username || Username.trim() === "") {
    console.log("Username is missing");
    throw new ApiError(400, "Username is required");
  }

  if (!Email || Email.trim() === "") {
    console.log("Email is missing");
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim() === "") {
    console.log("Password is missing");
    throw new ApiError(400, "Password is required");
  }

  const emailExists = await User.findOne({ Email });
  if (emailExists) {
    console.log("Email already registered");
    throw new ApiError(409, "Email already exists");
  }
  const usernameExists = await User.findOne({ Username });
  if (usernameExists) {
    console.log("Username already taken");
    throw new ApiError(409, "Username already exists");
  }

  let avatarURL = "";
  const avatarLocalPath = req.files?.Avatar?.[0]?.path;

  if (avatarLocalPath) {
    console.log("Uploading avatar to cloud storage");
    const uploadedImage = await uploadOncloudinary(avatarLocalPath);
    avatarURL = uploadedImage?.url || "";
  }

  console.log("Creating user in database");
  const newUser = await User.create({
    Username: Username.toLowerCase(),
    Email,
    password,
    Avatar: avatarURL,
    role : "user"
  });

  const userResponse = await User.findById(newUser._id).select(
    "-password -refreshTokens"
  );

  if (!userResponse) {
    console.log("Could not retrieve user after creation");
    throw new ApiError(500, "Something went wrong while creating the user");

    //res.status(500).json({ message: err.message });  apierror is design to handel this in efficient way
  }

  console.log("User registered successfully:", userResponse._id);

  return res
    .status(201)
    .json(new APIResponse(201, userResponse, "User registered successfully"));
});

const logoutuser = asynchandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "no user found");
  }

  await User.findOneAndUpdate(user._id, {
    $unset: {
      refreshToken: 1,
    },
    new: true,
  });

  const options ={
     secure : process.env.NODE_ENV= "production",
     httpOnly : true
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new APIResponse(200, "user logged out successfully"));
});

const changepassword = asynchandler(async(req,res,next)=>{

  const user = req.user;
  const {oldpassword, newpassword} = req.body;
 //console.log(oldpassword,newpassword)
   if(!user){
    throw new ApiError(404, "no user found")
  }


  if(!oldpassword && !newpassword){
    throw new ApiError(404,"no passowrd fetched")
  }
   
  const check_password_is_correct = await user.isPasswordcorrect(oldpassword)

  if(!check_password_is_correct){
    throw new ApiError(404,"password is incorrect")
  }

  user.password = newpassword;
  await user.save({validateBeforeSave:false})
  console.log(user.password)
  return res.status(200)
     .json(new APIResponse(200,"password change successfully"))

})

const updateprofile = asynchandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: user not found");
  }

  const { Username } = req.body;

  if (Username && Username.trim() === "") {
    throw new ApiError(400, "Username cannot be empty");
  }

  // Handle avatar upload
  let avatarURL = null;
  const avatarLocalPath = req.files?.Avatar?.[0]?.path;

  if (avatarLocalPath) {
    const uploadedAvatar = await uploadOncloudinary(avatarLocalPath);
    avatarURL = uploadedAvatar?.url;
  }

  // Prepare update object
  const updateData = {};
  if (Username) updateData.Username = Username.toLowerCase();
  if (avatarURL) updateData.Avatar = avatarURL;

  // Update user in DB
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  // Send response
  return res.status(200).json(
    new APIResponse(200, updatedUser, "User profile updated successfully")
  );
});

const change_accesstoken_and_refreshtoken = asynchandler(async(req,res,next)=>{
  const refreshtoken = req.cookies?.refreshToken;

  if(!refreshtoken){
    throw new ApiError(404,"no refreshtoken found");
  }
 console.log(refreshtoken)
  //finding the user based on refresh token
  const user = await User.findOne({refreshToken:refreshtoken});  
  const userId = user?._id;


  if(!userId){
    throw new ApiError(404,"no userId found for refreshtoken");
  }

//we shall generate new access token and refresh token
  const {accessToken,refreshToken} = await generate_token(userId);

  if(!accessToken || !refreshToken){
    throw new ApiError (404,"something went wrong while generating new tokens")
  }

  const options ={
    httpOnly : true,
    secure : process.env.NODE_ENV === "production"
  }
  return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(new APIResponse(200,{accessToken,refreshToken},"new access token and refresh token generated successfully"))
})



export { registeruser,checkAuth, loginuser, logoutuser ,changepassword,updateprofile, change_accesstoken_and_refreshtoken};
