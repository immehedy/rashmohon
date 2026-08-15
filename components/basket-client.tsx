"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Banknote,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  MapPinned,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingBag,
  StickyNote,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "./ui/button";

const DELIVERY_RATES = {
  dhaka: 80,
  outside: 110,
} as const;

type DeliveryArea = keyof typeof DELIVERY_RATES;

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
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("dhaka");

  const shipping = items.length ? DELIVERY_RATES[deliveryArea] : 0;
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
          deliveryArea,
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
      <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-24px_rgba(0,0,0,0.15)]">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10">
          <CheckCircle2 size={26} className="text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-serif text-2xl font-medium tracking-tight text-foreground">
          {dict.orderSuccess}
        </h1>
        <div className="mx-auto mt-5 w-16 border-t border-dashed border-neutral-300" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
      {/* Basket */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-primary/10">
              <ShoppingBag
                size={15}
                className="text-primary"
                strokeWidth={1.75}
              />
            </span>
            <h2 className="font-serif text-lg font-medium tracking-tight text-foreground">
              {dict.cart}
            </h2>
          </div>
          {items.length > 0 && (
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Package
              size={26}
              strokeWidth={1.25}
              className="mx-auto text-neutral-300"
            />
            <p className="mt-3 text-sm text-neutral-400">{dict.emptyBasket}</p>
          </div>
        ) : (
          <div className="max-h-[520px] divide-y divide-neutral-100 overflow-y-auto pr-1">
            {items.map((item) => {
              const name = locale === "bn" ? item.nameBn : item.name;
              const lineTotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="group grid grid-cols-[52px_1fr_auto] items-start gap-3 py-3.5">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 ring-1 ring-neutral-100">
                    <Image
                      src={item.images[0]}
                      alt={name}
                      fill
                      sizes="52px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {name}
                    </h3>
                    <p className="mt-0.5 text-xs tabular-nums text-neutral-400">
                      ৳{item.price.toLocaleString()}
                    </p>

                    <div className="mt-2 flex items-center gap-2.5">
                      <div className="flex w-fit items-center rounded-full border border-neutral-200">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="grid size-6 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }>
                          <Minus size={11} />
                        </button>
                        <span className="grid size-6 place-items-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="grid size-6 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }>
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove"
                        className="text-neutral-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100">
                        <Trash2 size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-0.5 text-sm font-semibold tabular-nums text-foreground">
                    ৳{lineTotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout — sticky so the button never scrolls out of view */}
      <form
        action={submitOrder}
        className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6 lg:sticky lg:top-6">
        <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
          <span className="grid size-8 place-items-center rounded-full bg-primary/10">
            <Truck size={15} className="text-primary" strokeWidth={1.75} />
          </span>
          <h2 className="font-serif text-lg font-medium tracking-tight text-foreground">
            {dict.checkout}
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="col-span-1 grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dict.name}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
              <User size={14} className="shrink-0 text-neutral-300" />
              <input
                name="name"
                required
                className="w-full min-w-0 border-0 bg-transparent p-0 text-sm text-foreground outline-none"
              />
            </div>
          </label>

          <label className="col-span-1 grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dict.phone}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
              <Phone size={14} className="shrink-0 text-neutral-300" />
              <input
                name="phone"
                required
                className="w-full min-w-0 border-0 bg-transparent p-0 text-sm text-foreground outline-none"
              />
            </div>
          </label>

          <label className="col-span-2 grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dict.address}
            </span>
            <div className="flex items-start gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-neutral-300" />
              <textarea
                name="address"
                required
                rows={2}
                className="min-h-0 w-full resize-none border-0 bg-transparent p-0 text-sm text-foreground outline-none"
              />
            </div>
          </label>

          {/* Delivery area — segmented control, drives shipping cost */}
          <div className="col-span-2 grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dict.deliveryArea ?? "Delivery area"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryArea("dhaka")}
                aria-pressed={deliveryArea === "dhaka"}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  deliveryArea === "dhaka"
                    ? "border-primary/40 bg-primary/5"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}>
                <span className="flex items-center gap-2">
                  <Building2
                    size={14}
                    className={
                      deliveryArea === "dhaka"
                        ? "text-primary"
                        : "text-neutral-300"
                    }
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {dict.insideDhaka ?? "Inside Dhaka"}
                  </span>
                </span>
                <span className="text-xs tabular-nums text-neutral-400">
                  ৳{DELIVERY_RATES.dhaka}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryArea("outside")}
                aria-pressed={deliveryArea === "outside"}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  deliveryArea === "outside"
                    ? "border-primary/40 bg-primary/5"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}>
                <span className="flex items-center gap-2">
                  <MapPinned
                    size={14}
                    className={
                      deliveryArea === "outside"
                        ? "text-primary"
                        : "text-neutral-300"
                    }
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {dict.outsideDhaka ?? "Outside Dhaka"}
                  </span>
                </span>
                <span className="text-xs tabular-nums text-neutral-400">
                  ৳{DELIVERY_RATES.outside}
                </span>
              </button>
            </div>
            <input type="hidden" name="deliveryArea" value={deliveryArea} />
          </div>

          <label className="col-span-2 grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {dict.note}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
              <StickyNote size={14} className="shrink-0 text-neutral-300" />
              <input
                name="note"
                className="w-full min-w-0 border-0 bg-transparent p-0 text-sm text-foreground outline-none"
              />
            </div>
          </label>
        </div>

        {/* Receipt-style summary */}
        <div className="mt-4 rounded-2xl bg-neutral-50/70 p-4">
          <div className="grid gap-1.5 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>{dict.subtotal}</span>
              <span className="tabular-nums text-foreground">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>
                {dict.shipping}{" "}
                <span className="text-neutral-400">
                  ·{" "}
                  {deliveryArea === "dhaka"
                    ? dict.insideDhaka ?? "Inside Dhaka"
                    : dict.outsideDhaka ?? "Outside Dhaka"}
                </span>
              </span>
              <span className="tabular-nums text-foreground">
                ৳{shipping.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="my-3 border-t border-dashed border-neutral-300" />

          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {dict.total}
            </span>
            <span className="font-serif text-xl font-medium tabular-nums text-foreground">
              ৳{total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3.5 py-2.5 text-xs leading-snug text-neutral-600">
          <Banknote
            size={15}
            className="shrink-0 text-primary"
            strokeWidth={1.75}
          />
          <span>{dict.cod}</span>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading || !items.length}
          className="mt-4">
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            dict.placeOrder
          )}
        </Button>
      </form>
    </div>
  );
}
