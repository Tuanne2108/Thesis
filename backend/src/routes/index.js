const authRouter = require("./AuthRouter");
const userRouter = require("./UserRouter");
const productRouter = require("./ProductRouter");
const sellerRouter = require("./SellerRouter");
const routes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/seller", sellerRouter);
    app.use("/api/product", productRouter);
};

module.exports = routes;