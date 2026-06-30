import express, { type Application, type Request, type Response } from "express";;
import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute} from "./modules/issues/issue.route";


const app: Application = express();

// Built-in middleware
app.use(express.json());
// app.use(CookieParser());
// app.use(express.text());
// app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://localhost:3000", "https://devpulse-prod.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        maxAge: 600,
    }),
);


// Root route handler
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        "status": true,
        "message": "DevPulse API is live and ready to handle requests",
        "version": "1.0.0",
        "author": "Islamul Hoque",
        "server": "Express.js & TypeScript",
        "health": "healthy"
    })
})

// Application routing setup
app.use('/api/auth', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/issues',issueRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;