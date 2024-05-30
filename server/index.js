import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./src/db/index.js";
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 4000;

connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server listening at port ${port}`);
    })
  )
  .catch((error) => console.log("Mongo DB Error: ", error));
