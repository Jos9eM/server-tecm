import Server from "./classes/server";
import userRoutes from "./routes/usuarios";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import express from "express";


const server = new Server();

// Body Parser
// ----------------------------------------------------------------
// Middleware procesa los metodos del servicio 
// ----------------------------------------------------------------

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(morgan("dev"));
server.app.use(express.json());

// User Routes

server.app.use("/user", userRoutes);

// DB Connection

mongoose
  .connect("mongodb://0.0.0.0:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((res) => {
    console.log("Connected API Database - ONLINE");
  })
  .catch((err) => {
    console.log(`Initial API Database connection error occured -`, err);
  });

//Starting Express server

server.start(() => {
  console.log(`Server started on  port ${server.port}`);
});
