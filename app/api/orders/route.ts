import { NextResponse } from "next/server";

type OrderItem = {
  name?: string;
  nameBn?: string;
  price?: number;
  quantity?: number;
};

const taka = (value: unknown) =>
  `৳${Number(value ?? 0).toLocaleString("en-IN")}`;

function buildOrderMessage(body: any): string {
  const customer = body.customer ?? {};
  const locale = body.locale === "bn" ? "bn" : "en";
  const items: OrderItem[] = Array.isArray(body.items) ? body.items : [];

  const itemName = (item: OrderItem) =>
    (locale === "bn" && item.nameBn) || item.name || "Item";

  const deliveryArea =
    body.deliveryArea ?? customer.deliveryArea ?? "dhaka";
  const deliveryLabel =
    deliveryArea === "outside" ? "Outside Dhaka" : "Inside Dhaka";

  const lines: string[] = [];

  lines.push("**Customer**");
  lines.push(
    `Name: ${customer.name ?? "-"}`
  );
  lines.push(
    `Phone: [${customer.phone ?? "-"}](tel:${customer.phone ?? ""})`
  );
  lines.push(
    `Address: [${customer.address ?? "-"}](https://maps.google.com/?q=${encodeURIComponent(
      customer.address ?? ""
    )})`
  );
  lines.push(`Delivery: ${deliveryLabel}`);

  lines.push("");
  lines.push("**Items**");
  lines.push("| Item | Qty | Price |");
  lines.push("| --- | --- | --- |");
  for (const item of items) {
    const quantity = item.quantity ?? 1;
    const lineTotal = (item.price ?? 0) * quantity;
    lines.push(
      `| ${itemName(item)} | ${quantity} | ${taka(lineTotal)} |`
    );
  }

  lines.push("");
  lines.push(`Subtotal: ${taka(body.subtotal)}`);
  lines.push(`Shipping (${deliveryLabel}): ${taka(body.shipping)}`);
  lines.push(`**Total: ${taka(body.total)}**`);

  if (customer.note) {
    lines.push("");
    lines.push(`Note: ${customer.note}`);
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ntfyServer = process.env.NTFY_SERVER || "https://ntfy.sh";
    const topic = process.env.NTFY_TOPIC;

    if (topic) {
      const itemCount = Array.isArray(body.items) ? body.items.length : 0;

      await fetch(`${ntfyServer}/${topic}`, {
        method: "POST",
        headers: {
          Title: `New RASHMOHON Order (${itemCount} ${
            itemCount === 1 ? "item" : "items"
          })`,
          Priority: "high",
          Tags: "package",
          Markdown: "yes",
        },
        body: buildOrderMessage(body),
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
