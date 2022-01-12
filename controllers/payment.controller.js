const stripe = require("stripe")(
    "sk_test_51J33DXAS6wWQYlKwTjFjso6fSO9WJAZE33A3FFMhfoIO7W9jz57TexeIwJTFeJ5aBGfCAjzD7knlNQ9CXYRmsjZm00bfyQQ1ij"
);
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const User = require("../models/User");

exports.makePayment = async(req, res, next) => {
    const { job } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "pkr",
                job_data: {
                    title: Job.title,
                },
                unit_amount: Job.amount * 100,
            },
        }, ],
        mode: "payment",
        success_url,
        cancel_url,
    });
    if (req.body.package === "Basic") {} else if (req.body.package === "Standard") {} else if (req.body.package === "Premium") {}

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.package[value],
        currency: "usd",
    });
};