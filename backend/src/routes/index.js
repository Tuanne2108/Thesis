const authRouter = require("./AuthRouter");
const userRouter = require("./UserRouter");
const chatbotRouter = require("./ChatbotRouter");
const routes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/chatbot", chatbotRouter);
};

module.exports = routes;