import express, { type Application, type Request, type Response } from "express";

const app: Application = express();
const port = process.env.PORT || 3000;

// Parse JSON payloads from incoming requests
app.use(express.json());

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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});