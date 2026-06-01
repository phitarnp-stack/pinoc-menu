"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type {
  Product,
  ProductStatus,
  ProductType,
  RoastLevel,
} from "@/src/types/menu";

type ProductCrudPageProps = {
  title: string;
  description: string;
  initialProducts: Product[];
  defaultProductType: ProductType;
};

type ProductFormState = {
  name: string;
  productType: ProductType;
  status: ProductStatus;
  price: string;
  description: string;
  flavorNotes: string;
  imagePlaceholder: string;
  availableFor: string;
  origin: string;
  process: string;
  roastLevel: RoastLevel;
};

const productTypes: { label: string; value: ProductType }[] = [
  { label: "Coffee Beans", value: "coffee_bean" },
  { label: "Craft Cocoa", value: "craft_cocoa" },
  { label: "Matcha", value: "matcha" },
];

const roastLevels: RoastLevel[] = [
  "Light",
  "Medium-Light",
  "Medium",
  "Medium-Dark",
];

const makeDefaultFormState = (
  productType: ProductType,
): ProductFormState => ({
  name: "",
  productType,
  status: "active",
  price: "",
  description: "",
  flavorNotes: "",
  imagePlaceholder: "",
  availableFor: "",
  origin: "",
  process: "",
  roastLevel: "Medium",
});

const productTypeLabel = (productType: ProductType) =>
  productTypes.find((item) => item.value === productType)?.label ?? productType;

const normalizeNotes = (notes: string) =>
  notes
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);

const createSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const createId = (name: string) =>
  `product-${createSlug(name)}-${Date.now().toString(36)}`;

const formatPrice = (price: number) => `฿${price}`;

export function ProductCrudPage({
  title,
  description,
  initialProducts,
  defaultProductType,
}: ProductCrudPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [formState, setFormState] = useState<ProductFormState>(
    makeDefaultFormState(defaultProductType),
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeCount = useMemo(
    () => products.filter((product) => product.status === "active").length,
    [products],
  );

  const inactiveCount = products.length - activeCount;
  const isEditing = editingId !== null;

  const updateField = <Key extends keyof ProductFormState>(
    field: Key,
    value: ProductFormState[Key],
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState(makeDefaultFormState(defaultProductType));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextProduct: Product = {
      id: editingId ?? createId(formState.name),
      slug: editingId
        ? products.find((product) => product.id === editingId)?.slug ??
          createSlug(formState.name)
        : createSlug(formState.name),
      name: formState.name.trim(),
      productType: formState.productType,
      status: formState.status,
      price: Number(formState.price),
      description: formState.description.trim(),
      flavorNotes: normalizeNotes(formState.flavorNotes),
      tasteProfileIds: [],
      imagePlaceholder: formState.imagePlaceholder.trim(),
      availableFor: formState.availableFor.trim(),
      origin: formState.origin.trim() || undefined,
      process: formState.process.trim() || undefined,
      roastLevel: formState.roastLevel,
    };

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId ? nextProduct : product,
        ),
      );
    } else {
      setProducts((current) => [nextProduct, ...current]);
    }

    resetForm();
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      productType: product.productType,
      status: product.status,
      price: String(product.price),
      description: product.description,
      flavorNotes: product.flavorNotes.join(", "),
      imagePlaceholder: product.imagePlaceholder,
      availableFor: product.availableFor,
      origin: product.origin ?? "",
      process: product.process ?? "",
      roastLevel: product.roastLevel ?? "Medium",
    });
  };

  const toggleProductStatus = (productId: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: product.status === "active" ? "inactive" : "active",
            }
          : product,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
              >
                Admin
              </Link>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#5f4635]">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-80">
              <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  Active
                </p>
                <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
              </div>
              <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  Inactive
                </p>
                <p className="mt-2 text-3xl font-semibold">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/68 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                    {isEditing ? "Edit Product" : "Add Product"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {isEditing ? "Update details" : `Create ${title}`}
                  </h2>
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>

              <div className="mt-7 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Name
                  <input
                    required
                    value={formState.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Type
                    <select
                      value={formState.productType}
                      onChange={(event) =>
                        updateField(
                          "productType",
                          event.target.value as ProductType,
                        )
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      {productTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Status
                    <select
                      value={formState.status}
                      onChange={(event) =>
                        updateField("status", event.target.value as ProductStatus)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Price
                    <input
                      required
                      min="0"
                      type="number"
                      value={formState.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Roast Level
                    <select
                      value={formState.roastLevel}
                      onChange={(event) =>
                        updateField("roastLevel", event.target.value as RoastLevel)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      {roastLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Description
                  <textarea
                    required
                    value={formState.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    className="min-h-28 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Flavor Notes
                  <input
                    required
                    value={formState.flavorNotes}
                    onChange={(event) =>
                      updateField("flavorNotes", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    placeholder="Jasmine, cacao, honey"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Origin
                    <input
                      value={formState.origin}
                      onChange={(event) =>
                        updateField("origin", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Process
                    <input
                      value={formState.process}
                      onChange={(event) =>
                        updateField("process", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Available For
                  <input
                    required
                    value={formState.availableFor}
                    onChange={(event) =>
                      updateField("availableFor", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Image Placeholder
                  <input
                    required
                    value={formState.imagePlaceholder}
                    onChange={(event) =>
                      updateField("imagePlaceholder", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="mt-7 min-h-12 w-full rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719]"
              >
                {isEditing ? "Save Changes" : "Add Product"}
              </button>
            </form>

            <div className="grid gap-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">{product.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                        {product.description}
                      </p>
                    </div>
                    <span
                      className={
                        product.status === "active"
                          ? "w-fit rounded-full bg-[#2b1a12] px-3 py-1 text-xs font-semibold text-[#fff8ed]"
                          : "w-fit rounded-full bg-[#7d4d2f]/15 px-3 py-1 text-xs font-semibold text-[#7d4d2f]"
                      }
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                      {productTypeLabel(product.productType)}
                    </span>
                    <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                      {formatPrice(product.price)}
                    </span>
                    {product.roastLevel ? (
                      <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                        {product.roastLevel}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-3 text-sm leading-7 text-[#5f4635]">
                    <p>
                      <span className="font-semibold text-[#241710]">
                        Flavor:
                      </span>{" "}
                      {product.flavorNotes.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold text-[#241710]">
                        Available for:
                      </span>{" "}
                      {product.availableFor}
                    </p>
                    <p>
                      <span className="font-semibold text-[#241710]">
                        Image:
                      </span>{" "}
                      {product.imagePlaceholder}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProductStatus(product.id)}
                      className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                    >
                      {product.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
