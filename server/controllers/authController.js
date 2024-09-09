import User from "../models/UserModel.js";
import { redis } from "../utils/redis.js";
import sendMail from "../utils/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const __dirname = path.dirname(__filename);
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    if (!checkUser) {
      const checkEmail = await redis.exists("pending_" + email);
      if (checkEmail) {
        return res.json({
          success: false,
          message:
            "Activation code already sent please login to active your account",
        });
      } else {
        try {
          const activationCode = Math.floor(
            1000 + Math.random() * 9000
          ).toString();
          const data = { user: { name: username }, activationCode };
          await sendMail({
            email: email,
            subject: "Activate your account",
            template: "activation-mail.ejs",
            data,
          });
          //set activitionCode and try time to redis
          const token = jwt.sign(
            {
              email,
              username,
            },
            process.env.SECRET_KEY,
            { expiresIn: "5m" }
          );
          await redis.hset("pending_" + email, {
            activationCode: activationCode,
            incorrect: 0,
            token: token,
            password: password,
          });
          await redis.expire("pending_" + email, 60 * 5);

          res.status(201).json({
            success: true,
            message: `Please check your email: ${email} to activate your account!`,
            token: token,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
            token,
          });
        }
      }
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const activeEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const { verifyToken } = req.params;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid otp",
      });
    }
    if (!verifyToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided", success: false });
    }

    try {
      const decodedToken = jwt.verify(verifyToken, process.env.SECRET_KEY);
      const email = decodedToken.email;
      const checkToken = await redis.hget("pending_" + email, "token");
      const password = await redis.hget("pending_" + email, "password");
      if (verifyToken !== checkToken) {
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
      }

      const checkEmail = await redis.exists("pending_" + email);

      if (!checkEmail) {
        return res.json({
          success: false,
          message:
            "Activation code expired or you did not register by this email! Please register again",
        });
      } else {
        const currentIncorrect = await redis.hget(
          "pending_" + email,
          "incorrect"
        );
        const currentActivationCode = await redis.hget(
          "pending_" + email,
          "activationCode"
        );
        if (currentIncorrect >= 5) {
          return res.json({
            success: false,
            message: "You have tried too many times! Please register again",
          });
        }
        if (otp !== currentActivationCode) {
          const newIncorrect = parseInt(currentIncorrect, 10) + 1;
          await redis.hset("pending_" + email, "incorrect", newIncorrect);

          return res.json({
            success: false,
            message: "Activation code doesn't match! Please try again",
          });
        } else {
          const hashedPassword = bcryptjs.hashSync(password, 10);

          const newUser = new User({
            email: email,
            username: decodedToken.username,
            password: hashedPassword,
            image: `https://avatar.iran.liara.run/username?username=${decodedToken.username}`,
          });

          await redis.del("pending_" + email);
          await newUser.save();
          res.json({
            success: true,
            message: "Account activated successfully! Please login",
          });
        }
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token or Expired Token",
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      const checkEmail = await redis.exists("pending_" + email);
      if (checkEmail) {
        const token = await redis.hget("pending_" + email, "token");
        return res.status(401).json({
          success: false,
          action: "redirect to active page",
          message: "Please activate your account first",
          token: token,
        });
      } else {
        return res.json({
          success: false,
          message: "User doesn't exists!",
        });
      }
    }

    const validPassword = bcryptjs.compareSync(password, checkUser.password);
    if (!validPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        username: checkUser.username,
        image: checkUser.image,
      },
      process.env.SECRET_KEY,
      { expiresIn: "60m" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        id: checkUser._id,
        username: checkUser.username,
        image: checkUser.image,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const loginByGoogle = async (req, res) => {
  try {
    const { email, username, image } = req.body;
    //get accessToken from cookie

    const exitedUser = await User.findOne({ email });
    if (exitedUser) {
      const token = jwt.sign(
        {
          _id: exitedUser._id,
          email: exitedUser.email,
          image: exitedUser.image,
          username: exitedUser.username,
        },
        process.env.SECRET_KEY
      );
      const { password: hashedPassword, ...rest } = exitedUser._doc;
      res.cookie("token", token, { httpOnly: true, secure: false }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: exitedUser.email,
          id: exitedUser._id,
          username: exitedUser.username,
          image: exitedUser.image,
        },
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        image,
        isGoogle: true,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          _idid: newUser._id,
          email: newUser.email,
          image: newUser.image,
          username: newUser.username,
        },
        process.env.SECRET_KEY
      );
      const { password: hashedPassword2, ...rest } = newUser._doc;

      res.cookie("token", token, { httpOnly: true, secure: false }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: newUser.email,
          id: newUser._id,
          username: newUser.username,
          image: newUser.image,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

export const sendLinkToResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exists!",
      });
    }
    if (checkUser.isGoogle) {
      return res.json({
        success: false,
        message: "Please reset password from google account",
      });
    }
    const existedToken = await redis.exists("reset_" + email);
    if (existedToken) {
      return res.json({
        success: false,
        message: "Reset password link already sent",
      });
    } else {
      try {
        const resetToken = jwt.sign(
          {
            email,
          },
          process.env.SECRET_KEY,
          { expiresIn: "5m" }
        );
        await sendMail({
          email: email,
          subject: "Reset your password",
          template: "forgot-mail.ejs",
          data: { resetToken },
        });
        await redis.set("reset_" + email, resetToken);
        await redis.expire("reset_" + email, 60 * 5);
        res.status(201).json({
          success: true,
          redirect: true,
          message: `Please check your email: ${email} to reset your password!`,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token or Token expired",
      });
    }
    const email = decodedToken.email;
    const checkToken = await redis.get("reset_" + email);
    if (token !== checkToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    await User.findOneAndUpdate(
      {
        email,
      },
      {
        password: hashedPassword,
      }
    );
    await redis.del("reset_" + email);
    res.json({
      success: true,
      redirect: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

//logout

export const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};
