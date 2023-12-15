import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import stripe from "stripe";
import Order from './models/order.model.js';
//security
import helmet from 'helmet';
import xssAdvanced from 'xss-advanced';
import mongoSanitize from "express-mongo-sanitize";



// UncaughtException Error
process.on("uncaughtException", (err) => {
    console.log("uncaughtException Shutting down application");
    console.log(err.name, err.message);
    process.exit(1);
});

const app = express()
const stripeInstance = stripe(process.env.STRIPE_SERVER_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET;
console.log(process.env.NODE_ENV + " mode")

//=========================== middlewares
app.use(cors({
    origin: 'https://657c880b1ade910b0846dd7d--chic-pie-6e2053.netlify.app/',
}));
app.use(helmet());
app.use(xssAdvanced());
app.use(mongoSanitize());
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan('dev'));

//=========================== routes import
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import brandRouter from "./routes/brand.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import ApiError from "./utils/ApiError.js";

//========================= routes declaration

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

// Webhook
// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   async (request, response) => {
//     const sig = request.headers['stripe-signature'];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         const paymentIntentSucceeded = event.data.object;

//         const order = await Order.findById(
//           paymentIntentSucceeded.metadata.orderId
//         );
//         order.paymentStatus = 'received';
//         await order.save();

//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   }
// );
app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.get("/favicon.ico", (req, res) => {
    res.send("Hello from server");
})

//========================== Create PaymentIntent
app.post("/api/v1/create-payment-intent", async (req, res) => {
    const { totalAmount, orderId } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: totalAmount * 100, // for decimal compensation
        currency: 'inr',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            orderId,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

//========================== Not found
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

//========================== global ERROR validation middlewares
app.use(errorMiddleware);

export { app }