import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const dataBaseUrl = process.env.DATABASE_URL;

app.use(
    cors({
        origin:[process.env.ORIGIN],
        methods: ["GET","POST","PUT","PATCH","DELETE"],
        credentials:true,
       })     
)

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/uploads/files",express.static("uploads/files"));
app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/channel",channelRoutes);

const server = app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
});

setupSocket(server);

mongoose
.connect(dataBaseUrl).then(()=> console.log("Db connection successfully"))
.catch((err)=>console.log(err.message))
;

