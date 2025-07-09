import mongoose, { type Document, Schema } from "mongoose"

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: {
    product: mongoose.Types.ObjectId
    name: string
    price: number
    quantity: number
    image: string
  }[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: "stripe" | "paypal" | "google_pay"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  tax: number
  shipping: number
  total: number
  stripePaymentIntentId?: string
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
})

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "google_pay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    stripePaymentIntentId: { type: String },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
