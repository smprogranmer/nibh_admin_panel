import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdCloudUpload } from 'react-icons/md'
import { createProduct, updateProduct, deleteProduct } from '../utilits/api/productService'

const initialProducts = [
  { id: 1, name: 'Classic Black Abaya', sku: 'ABY-001', category: 'Classic', price: 120, stock: 48, status: 'Active', image: 'CB' },
  { id: 2, name: 'Embroidered Dubai Abaya', sku: 'ABY-002', category: 'Premium', price: 195, stock: 22, status: 'Active', image: 'ED' },
  { id: 3, name: 'Chiffon Open Abaya', sku: 'ABY-003', category: 'Casual', price: 110, stock: 35, status: 'Active', image: 'CO' },
  { id: 4, name: 'Pearl Butterfly Abaya', sku: 'ABY-004', category: 'Premium', price: 160, stock: 14, status: 'Active', image: 'PB' },
  { id: 5, name: 'Linen Casual Abaya', sku: 'ABY-005', category: 'Casual', price: 90, stock: 0, status: 'Out of Stock', image: 'LC' },
  { id: 6, name: 'Velvet Occasion Abaya', sku: 'ABY-006', category: 'Occasion', price: 240, stock: 9, status: 'Low Stock', image: 'VO' },
  { id: 7, name: 'Floral Printed Abaya', sku: 'ABY-007', category: 'Casual', price: 105, stock: 31, status: 'Active', image: 'FP' },
  { id: 8, name: 'Silk Luxe Abaya', sku: 'ABY-008', category: 'Premium', price: 280, stock: 7, status: 'Low Stock', image: 'SL' },
  { id: 9, name: 'Cotton Everyday Abaya', sku: 'ABY-009', category: 'Classic', price: 85, stock: 62, status: 'Active', image: 'CE' },
  { id: 10, name: 'Gold Thread Abaya', sku: 'ABY-010', category: 'Occasion', price: 320, stock: 5, status: 'Low Stock', image: 'GT' },
]

const statusStyles = {
  'Active': 'bg-emerald-100 text-emerald-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  'Out of Stock': 'bg-rose-100 text-rose-700',
}

const categories = ['All', 'Classic', 'Premium', 'Casual', 'Occasion']

const avatarColors = ['bg-gold/20 text-gold-dark', 'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700', 'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700']

const Products = () => {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description:"",
      sku: '',
      category: 'Borka',
      price: '',
      size52: '',
      size54: "",
      size56: "",
    },
  })

  const watchedPhoto = watch('photo')

  // Update preview whenever a new file is picked
  useEffect(() => {
    if (watchedPhoto && watchedPhoto.length > 0) {
      const file = watchedPhoto[0]
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [watchedPhoto])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchSearch && matchCat
  })

  const openAdd = () => {
    setEditProduct(null)
    setServerError(null)
    setPreview(null)
    reset({ name: '', sku: '', category: 'Classic', price: '', stock: '', photo: null })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setServerError(null)
    setPreview(p.photoUrl || null) // if your saved product has a photo URL
    reset({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      photo: null,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      // optionally show a toast here
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    setServerError(null)
    const stock = Number(data.stock)
    const status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'Active'

    try {
      if (editProduct) {
        const updated = await updateProduct(editProduct.id, data)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editProduct.id
              ? {
                  ...p,
                  ...data,
                  price: Number(data.price),
                  stock,
                  status,
                  photoUrl: updated?.photoUrl || p.photoUrl,
                }
              : p
          )
        )
      } else {
        const created = await createProduct(data)
        setProducts((prev) => [
          ...prev,
          {
            id: created?.id || Date.now(),
            name: data.name,
            sku: data.sku,
            category: data.category,
            price: Number(data.price),
            stock,
            status,
            image: data.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
            photoUrl: created?.photoUrl || preview,
          },
        ])
      }
      setShowModal(false)
    } catch (err) {
      console.error(err)
      setServerError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${category === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Price</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground hidden md:table-cell">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.photoUrl ? (
                        <img
                          src={product.photoUrl}
                          alt={product.name}
                          className="h-9 w-9 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                          {product.image}
                        </div>
                      )}
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{product.sku}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{product.category}</td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">SAR {product.price}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground hidden md:table-cell">{product.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}>
                      {product.status}
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
                        onClick={() => handleDelete(product.id)}
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
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors">Prev</button>
            <button className="rounded border border-border bg-primary px-3 py-1 text-xs text-primary-foreground">1</button>
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors">Next</button>
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
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Photo upload */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Product Photo</label>
                <Controller
                  name="photo"
                  control={control}
                  rules={{ required: editProduct ? false : 'Photo is required' }}
                  render={({ field: { onChange, name, ref } }) => (
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center gap-3 rounded-lg border border-dashed border-input px-3 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="h-14 w-14 rounded-lg object-cover" />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          <MdCloudUpload className="h-6 w-6" />
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">Click to upload</p>
                        <p>PNG or JPG</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="files"
                        accept="image/*"
                        name={name}
                        ref={ref}
                        className="hidden"
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </label>
                  )}
                />
                {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Black Abaya"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="e.g. ABY-011"
                  {...register('sku', { required: 'SKU is required' })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Price (SAR)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  {...register('stock', {
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' },
                  })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Category</label>
                <select
                  {...register('category', { required: true })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {['Abaya', 'Borka', 'Hijab', 'Fixed Hijab',].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {serverError && <p className="text-xs text-red-500">{serverError}</p>}
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
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Products