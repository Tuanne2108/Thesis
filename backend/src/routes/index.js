const authRouter = require("./AuthRouter");
const userRouter = require("./UserRouter");

const routes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
};

module.exports = routes;