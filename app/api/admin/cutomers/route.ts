import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Order from "@/models/Order"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id })
        const orderCount = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

        return {
          ...customer,
          orderCount,
          totalSpent,
        }
      }),
    )

    const total = await User.countDocuments({ role: "customer" })

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
