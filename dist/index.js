"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const server = new server_1.default();
// Body Parser
// ----------------------------------------------------------------
// Middleware procesa los metodos del servicio 
// ----------------------------------------------------------------
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use((0, morgan_1.default)("dev"));
server.app.use(express_1.default.json());
// User Routes
server.app.use("/user", usuarios_1.default);
// DB Connection
mongoose_1.default
    .connect("mongodb://0.0.0.0:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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
