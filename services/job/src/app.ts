import express from "express"
import jobRoutes from "./routes/job.js"
import cors from "cors";




const app =express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use('/api/job',jobRoutes)

export default app;



