const authRouter = require("./AuthRouter");

const routes = (app) => {
    app.use("/api/auth", authRouter);
};

module.exports = routes;