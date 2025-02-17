import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"



const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"], 
          imgSrc: ["'self'", "res.cloudinary.com"], // Allow images from Cloudinary
          mediaSrc: ["'self'", "res.cloudinary.com"], // Allow videos from Cloudinary
          scriptSrc: ["'self'", "'unsafe-inline'"], 
          styleSrc: ["'self'", "'unsafe-inline'"], 
      },
  },
}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));

//Routes
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js";
import like from "./routes/like.routes.js";
import review from "./routes/review.routes.js"
import healthCheck from "./routes/healthCheck.routes.js"

//Routes declaration

app.use("/api/v1/users",userRouter);
// app.use("/api/pro")

app.use("/api/v1/products",productRouter)

app.use("/api/v1/likes",like)

app.use("/api/v1/reviews",review)

app.use("/api/v1/health-check",healthCheck)

export {app}