import authRouter from './AuthRouter.js';
import userRouter from './UserRouter.js';
import chatbotRouter from './ChatbotRouter.js';

const routes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/chatbot', chatbotRouter);
};

export default routes;
