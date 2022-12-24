import Server from "./src/server";
import router from "./src/routes/usuarios";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";

async function main(){
  const server = new Server();
  
  //Starting Express server
  await server.start();

}

  // Body Parser

/*
server.app.use(bodyParser.urlencoded({ extended: true }));

// User Routes

server.app.use("/user", userRoutes);

// DB Connection

mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((res) => {
    console.log("Connected API Database - ONLINE");
  })
  .catch((err) => {
    console.log(`Initial API Database connection error occured -`, err);
  });
*/

main();




