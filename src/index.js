import "dotenv/config";
import express from "express";
import connectDB from "../config/db.js";
import { app } from "./app.js";

//Database and Server Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server is running on port: ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log(`MONGODB Connection Failed!`, err);
  });


// UnhandleRejection || Database Error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UnhandleRejection Shutting down application..........");
  server.close(() => {
    process.exit(1);
  })

});
