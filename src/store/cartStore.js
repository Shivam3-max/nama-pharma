import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutOpen: false,
      appliedCoupon: null,

      addItem: (product, variant, qty = 1) => {
        const items = get().items
        const key = `${product.id}-${variant.id}`
        const existing = items.find(i => i.key === key)
        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) })
        } else {
          set({ items: [...items, { key, product, variant, qty }] })
        }
      },

      removeItem: (key) => set({ items: get().items.filter(i => i.key !== key) }),

      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return }
        set({ items: get().items.map(i => i.key === key ? { ...i, qty } : i) })
      },

      clearCart: () => set({ items: [] }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.variant.price * i.qty, 0)
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      },

      applyCoupon: (code) => {
        const coupons = {
          'WELCOME10': { type: 'percent', value: 10, label: '10% Off' },
          'BULL20': { type: 'percent', value: 20, label: '20% Off' },
          'FIRST15': { type: 'percent', value: 15, label: '15% Off' },
          'SAVE200': { type: 'flat', value: 200, label: '₹200 Off' },
        }
        const coupon = coupons[code.toUpperCase()]
        if (coupon) {
          set({ appliedCoupon: { code: code.toUpperCase(), ...coupon } })
          return { success: true, message: `${coupon.label} applied!` }
        }
        return { success: false, message: 'Invalid coupon code' }
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      getDiscount: () => {
        const { appliedCoupon } = get()
        const subtotal = get().items.reduce((sum, i) => sum + i.variant.price * i.qty, 0)
        if (!appliedCoupon) return 0
        if (appliedCoupon.type === 'percent') return Math.round(subtotal * appliedCoupon.value / 100)
        return appliedCoupon.value
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCheckout: () => set({ checkoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ checkoutOpen: false }),
    }),
    { name: 'nama-pharma-cart' }
  )
)
