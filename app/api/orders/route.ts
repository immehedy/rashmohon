import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ntfyServer = process.env.NTFY_SERVER || "https://ntfy.sh";
    const topic = process.env.NTFY_TOPIC;

    if (topic) {
      await fetch(`${ntfyServer}/${topic}`, {
        method: "POST",
        headers: {
          Title: "New RASHMOHON Online Shop Order",
          Priority: "high",
          Tags: "package",
        },
        body: JSON.stringify({
          customer: body.customer,
          items: body.items?.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: body.subtotal,
          shipping: body.shipping,
          total: body.total,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to place order" },
      { status: 500 }
    );
  }
}
