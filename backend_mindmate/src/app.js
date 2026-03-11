import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

import userroutes from "./routes/user_routes.js";
import productroutes from "./routes/product_routes.js";
import orderroutes from "./routes/order_routes.js";
import notesroutes from "./routes/notes_order.js";
import cartroutes from "./routes/cart_routes.js";

app.use("/mindmate/cart", cartroutes);
app.use("/mindmate/notes", notesroutes);
app.use("/mindmate/orders", orderroutes);
app.use("/mindmate/products", productroutes);
app.use("/mindmate/users", userroutes);

export { app };
