import { create } from 'zustand'
import { api } from '../lib/api'

export const useOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true })
    const { ok, data } = await api.get('/orders/list.php')
    if (ok) set({ orders: data.orders || [] })
    set({ loading: false })
  },

  placeOrder: async ({ items, total, address, paymentMethod, razorpayOrderId }) => {
    const { ok, data } = await api.post('/orders/create.php', {
      items,
      total,
      address,
      payment_method: paymentMethod,
      razorpay_order_id: razorpayOrderId || null,
    })
    if (!ok) return { error: data.error || 'Failed to place order' }
    set({ orders: [data.order, ...get().orders] })
    return { success: true, order: data.order }
  },
}))
