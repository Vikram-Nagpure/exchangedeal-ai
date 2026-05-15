"use client";

import React, { useState, useEffect } from "react";

type PlatformType = "amazon" | "flipkart";

type DealData = {
  price: number;
  exchange: number;
  bank: number;
  coupon: number;
  final: number;
  rating: number;
  reviews: number;
  delivery: string;
};

type PhoneResult = {
  id: number;
  name: string;
  brand: string;
  storage: string;
  ram: string;
  image: string;
  category: string;
  trending: boolean;
  amazon: DealData;
  flipkart: DealData;
};

type FormType = {
  brand: string;
  model: string;
  storage: string;
  ram: string;
  condition: string;
  pincode: string;
};

const PHONE_DATA: Record<
  string,
  {
    models: string[];
    storage: string[];
    ram: string[];
  }
> = {
  Apple: {
    models: ["iPhone 13", "iPhone 14", "iPhone 15"],
    storage: ["128GB", "256GB", "512GB"],
    ram: ["4GB", "6GB"],
  },
  Samsung: {
    models: ["Galaxy S23", "Galaxy S24"],
    storage: ["128GB", "256GB"],
    ram: ["8GB", "12GB"],
  },
};

const MOCK_RESULTS: PhoneResult[] = [
  {
    id: 1,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    storage: "256GB",
    ram: "8GB",
    image: "📱",
    category: "flagship",
    trending: true,
    amazon: {
      price: 74999,
      exchange: 32000,
      bank: 5000,
      coupon: 2000,
      final: 35999,
      rating: 4.5,
      reviews: 2341,
      delivery: "Tomorrow",
    },
    flipkart: {
      price: 72999,
      exchange: 34000,
      bank: 3000,
      coupon: 1500,
      final: 34499,
      rating: 4.4,
      reviews: 3102,
      delivery: "2 days",
    },
  },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 12 }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "#6b7280", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function PlatformBadge({
  platform,
  isBest,
}: {
  platform: PlatformType;
  isBest: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: platform === "amazon" ? "#ff9900" : "#2874f0",
        color: "white",
      }}
    >
      {platform === "amazon" ? "Amazon" : "Flipkart"}
      {isBest && <span>🏆</span>}
    </span>
  );
}

function PhoneCard({
  result,
  userPhone,
}: {
  result: PhoneResult;
  userPhone: FormType;
}) {
  const bestPlatform: PlatformType =
    result.flipkart.final <= result.amazon.final
      ? "flipkart"
      : "amazon";

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #374151",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            {result.name}
          </div>

          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            {result.storage} • {result.ram}
          </div>

          <StarRating rating={result.amazon.rating} />
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12 }}>Best Price</div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#6366f1",
            }}
          >
            {fmt(
              Math.min(
                result.amazon.final,
                result.flipkart.final
              )
            )}
          </div>

          <PlatformBadge
            platform={bestPlatform}
            isBest={true}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {(["amazon", "flipkart"] as PlatformType[]).map(
          (pl) => {
            const d = result[pl];

            return (
              <div
                key={pl}
                style={{
                  background: "#1f2937",
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                <PlatformBadge
                  platform={pl}
                  isBest={bestPlatform === pl}
                />

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  Product Price
                </div>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {fmt(d.price)}
                </div>

                <div
                  style={{
                    color: "#10b981",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Exchange: {fmt(d.exchange)}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    borderTop: "1px solid #374151",
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    Final Price
                  </div>

                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {fmt(d.final)}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 13,
          color: "#10b981",
        }}
      >
        Best exchange deal for your{" "}
        {userPhone.model || "phone"}
      </div>
    </div>
  );
}

export default function ExchangeDealAI() {
  const [form, setForm] = useState<FormType>({
    brand: "",
    model: "",
    storage: "",
    ram: "",
    condition: "Good",
    pincode: "",
  });

  const [results, setResults] =
    useState<PhoneResult[]>([]);

  const models = form.brand
    ? PHONE_DATA[form.brand]?.models || []
    : [];

  const storages = form.brand
    ? PHONE_DATA[form.brand]?.storage || []
    : [];

  const handleCompare = () => {
    setResults(MOCK_RESULTS);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          ExchangeDeal AI
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: 30,
          }}
        >
          Compare Amazon & Flipkart exchange deals
        </p>

        <div
          style={{
            background: "#111827",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
            }}
          >
            <select
              value={form.brand}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setForm({
                  ...form,
                  brand: e.target.value,
                  model: "",
                })
              }
            >
              <option value="">Select Brand</option>

              {Object.keys(PHONE_DATA).map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            <select
              value={form.model}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setForm({
                  ...form,
                  model: e.target.value,
                })
              }
            >
              <option value="">Select Model</option>

              {models.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              value={form.storage}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setForm({
                  ...form,
                  storage: e.target.value,
                })
              }
            >
              <option value="">Select Storage</option>

              {storages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>
                setForm({
                  ...form,
                  pincode: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={handleCompare}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 14,
              background: "#6366f1",
              border: "none",
              borderRadius: 10,
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Compare Exchange Deals
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {results.map((r) => (
            <PhoneCard
              key={r.id}
              result={r}
              userPhone={form}
            />
          ))}
        </div>
      </div>
    </div>
  );
}