const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orders:[{
      date: {
        type: Date,
        default: Date.now,
      },
      total_amount: {
        type: Number,
        required: true,
      },
      coupon_type: {
        type: String,
      },
      coupon_amount: {
        type: Number,
      },
      payment_method: {
        type: String,
        required: true,
      },
      wallet_amount: {
        type: Number,
        default:0
      },
      offer: {
        type: Number,
        default:0
      },
      reason: {
        type: String,
      },
      products: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          status: {
            type: String,
            required: true,
          },
          delivery_date: {
            type:String,
            created:Date,
          }
        }
      ],
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses",
        required: true,
      },
    }]
  },
  { versionkey: false }
);

module.exports = mongoose.model("orders", orderSchema);
