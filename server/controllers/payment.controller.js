import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const API_DOMAIN = process.env.DOMAIN || "http://localhost:3000";
const API_PREFFIX = process.env.API_PREFFIX || "/api/v1";

export const PaymentController = {
  async createSession(req, res) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              product_data: {
                name: "Laptop",
                description: "Gaming Laptop",
              },
              currency: "usd",
              unit_amount: 200000, // 2000.00
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: "PS5",
                description: "Playstation 5",
              },
              currency: "usd",
              unit_amount: 63400, // 634.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${API_DOMAIN}${API_PREFFIX}/payment/success`,
        cancel_url: `${API_DOMAIN}${API_PREFFIX}/payment/cancel`,
      });

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
        results: session,
      });
    } catch (error) {
      console.error("Error in stripe session create:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during Stripe session",
        results: null,
      });
    }
  },
  async success(req, res) {
    res.send("success");
  },
  async cancel(req, res) {
    res.send("cancel");
  },
};
