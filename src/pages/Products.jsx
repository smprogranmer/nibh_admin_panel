import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCloudUpload,
} from "react-icons/md";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../utilits/api/productService";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out of Stock": "bg-rose-100 text-rose-700",
};

const categories = ["All", "Abaya", "Borka", "Hijab"];

const avatarColors = [
  "bg-gold/20 text-gold-dark",
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      model: "",
      slug: "",
      description: "",
      price: "",
      category: "Borka",
      size52: 0,
      size54: 0,
      size56: 0,
      images: [],
    },
  });

  const watchedImages = watch("images");

  // Update preview whenever a new file is picked
  useEffect(() => {
    if (!watchedImages?.length) {
      setPreview([]);
      return;
    }

    const urls = Array.from(watchedImages).map((file) =>
      URL.createObjectURL(file),
    );

    setPreview(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [watchedImages]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const reversedProducts = [...data.Products].reverse(); // Reverse the products array
        setProducts(reversedProducts); // Assuming the API returns an object with a "Products" array
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.model).includes(search);
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditProduct(null);
    setServerError(null);
    setPreview([]);
    reset({
      name: "",
      model: "",
      slug: "",
      description: "",
      price: "",
      category: "Classic",
      size52: "",
      size54: "",
      size56: "",
      images: [],
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    console.log("Editing product:", p);
    setEditProduct(p);
    setServerError(null);
    setPreview(p.images || null); // if your saved product has a photo URL
    reset({
      name: p.name || "",
      model: p.model || "",
      slug: p.slug || "",
      description: p.description || "",
      price: String(p.price) || "",
      category: p.category || "Classic",
      size52: p.sizes["52"] || "",
      size54: p.sizes["54"] || "",
      size56: p.sizes["56"] || "",
      images: [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      // optionally show a toast here
    }
  };

  const onSubmit = async (productData) => {
    // setSaving(true)
    setServerError(null);

    // const stock = Number(data.stock)
    // const status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'Active'

    if (editProduct) {
      const updated = await updateProduct(editProduct._id, productData);
      setShowModal(false);
    } else {
      const created = await createProduct(productData);
      setShowModal(false);
    }

    // try {
    //   setShowModal(false);
    // } catch (err) {
    //   console.error(err);
    //   setServerError(err.response?.data?.message || "Failed to save product");
    // } finally {
    //   // setSaving(false)
    // }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <MdSearch className="h-4 w-4 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none placeholder:text-muted-foreground text-foreground w-40"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MdFilterList className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <MdAdd className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                  model
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Price
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Stock
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => (
                <tr
                  key={product._id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images ? (
                        <img
                          src={product.images[0].url} // Use the URL if available, otherwise fallback to the first image
                          alt={product.name}
                          className="h-9 w-9 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[idx % avatarColors.length]}`}
                        >
                          {product.image}
                        </div>
                      )}
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">
                    {product.model}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">
                    {product.price}
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground hidden md:table-cell">
                    {product.stock || 198}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}
                    >
                      {product.status || "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MdVisibility className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <MdEdit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <MdDelete className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {products.length} products
          </p>
          <div className="flex gap-1">
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors">
              Prev
            </button>
            <button className="rounded border border-border bg-primary px-3 py-1 text-xs text-primary-foreground">
              1
            </button>
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl"
            noValidate
          >
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {editProduct ? "Edit Product" : "Add New Product"} -{" "}
                {editProduct?.name || ""}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Photo upload */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Product Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("images", {
                    required: "Images are required",
                    validate: (files) =>
                      files.length <= 5 || "Maximum 5 images",
                  })}
                />
                <div className="grid grid-cols-3 gap-2">
                  {preview.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      className="w-24 h-24 rounded object-cover"
                    />
                  ))}
                </div>
                {errors.images && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.images.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Classic Black Abaya"
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  model
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABY-011"
                  {...register("model", { required: "model is required" })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.model && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.model.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. simple-borka"
                  {...register("slug", { required: "Slug is required" })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor=""
                  className="block text-rs font-medium text-forground mb-1"
                >
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  {...register("description", { required: true })}
                />
                {errors.description && <p>{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Price{" "}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  52 Quantity
                </label>
                <input
                  type="number"
                  placeholder="0"
                  {...register("size52", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.size52 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.size52.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  54 Quantity
                </label>
                <input
                  type="number"
                  placeholder="0"
                  {...register("size54", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.size54 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.size54.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  56 Quantity
                </label>
                <input
                  type="number"
                  placeholder="0"
                  {...register("size56", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.size56 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.size56.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {["Abaya", "Borka", "Hijab", "Fixed Hijab"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {serverError && (
                <p className="text-xs text-red-500">{serverError}</p>
              )}
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground
                 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editProduct
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
