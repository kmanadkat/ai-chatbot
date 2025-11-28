import express, { type Request, type Response } from "express";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World 🌍!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});
