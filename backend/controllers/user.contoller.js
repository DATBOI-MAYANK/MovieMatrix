import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefershToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User Not Found.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All Fields are required!!");
  }
  if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
    throw new ApiError(400, "Ivalid Email");
  }
  // Password Edgecases
  const maxBytes = 72;
  const passwordByteLength = Buffer.from(password).length;
  const commonPasswords = new Set(["pass", "password", "12345", "qwerty"]);

  if (typeof password !== "string" || password.trim().length === 0) {
    throw new ApiError(400, "Password must contain non-whitespace characters");
  }
  if (passwordByteLength > maxBytes) {
    throw new ApiError(400, "Password exceeds safe length limits");
  }
  if (commonPasswords.has(password.toLowerCase())) {
    throw new ApiError(400, "Password is too common");
  }
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    password.length < 8
  ) {
    throw new ApiError(
      400,
      "Password must contain uppercase and lowercase letters and must be at least 8 characters long.",
    );
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Exits.");
  }

  const user = await User.create({
    username: username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken ",
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user  ",
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "All Fields are required. !!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(409, "User does not exist. !");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect. !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefershToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

export { registerUser, loginUser, logoutUser };
