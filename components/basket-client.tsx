"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";

export function BasketClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal());

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const shipping = items.length ? 80 : 0;
  const total = subtotal + shipping;

  async function submitOrder(formData: FormData) {
    if (!items.length) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: Object.fromEntries(formData.entries()),
          items,
          subtotal,
          shipping,
          total,
          locale,
        }),
      });

      if (!response.ok) throw new Error("Order failed");

      clear();
      setSubmitted(true);
    } catch {
      alert("Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <h1 className="text-2xl font-black">{dict.orderSuccess}</h1>
      </div>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1.25fr_.75fr]">
      <div className="rounded-2xl border border-neutral-200 p-5">
        <h2 className="text-xl font-bold">{dict.cart}</h2>

        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-500">
            {dict.emptyBasket}
          </div>
        ) : (
          <div className="mt-4">
            {items.map((item) => {
              const name = locale === "bn" ? item.nameBn : item.name;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[64px_1fr_auto] gap-3 border-b border-neutral-200 py-4"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                    <Image src={item.image} alt={name} fill sizes="64px" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">{name}</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      ৳{item.price.toLocaleString()}
                    </p>

                    <div className="mt-2 flex w-fit items-center overflow-hidden rounded-md border border-neutral-200">
                      <button
                        className="grid size-7 place-items-center"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="grid size-7 place-items-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        className="grid size-7 place-items-center"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="self-start text-neutral-400 hover:text-black"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form
        action={submitOrder}
        className="rounded-2xl border border-neutral-200 p-5"
      >
        <h2 className="text-xl font-bold">{dict.checkout}</h2>

        <div className="mt-5 grid gap-3">
          <label className="grid gap-1.5 text-xs font-bold">
            {dict.name}
            <input name="name" required className="rounded-lg border border-neutral-300 px-3 py-3 font-normal outline-none" />
          </label>

          <label className="grid gap-1.5 text-xs font-bold">
            {dict.phone}
            <input name="phone" required className="rounded-lg border border-neutral-300 px-3 py-3 font-normal outline-none" />
          </label>

          <label className="grid gap-1.5 text-xs font-bold">
            {dict.address}
            <textarea name="address" required className="min-h-24 rounded-lg border border-neutral-300 px-3 py-3 font-normal outline-none" />
          </label>

          <label className="grid gap-1.5 text-xs font-bold">
            {dict.note}
            <textarea name="note" className="rounded-lg border border-neutral-300 px-3 py-3 font-normal outline-none" />
          </label>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between py-2">
            <span>{dict.subtotal}</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>{dict.shipping}</span>
            <span>৳{shipping.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-200 pt-4 text-lg font-black">
            <span>{dict.total}</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="my-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
          {dict.cod}
        </div>

        <button
          disabled={loading || !items.length}
          className="btn w-full"
          type="submit"
        >
          {loading ? "..." : dict.placeOrder}
        </button>
      </form>
    </div>
  );
}
