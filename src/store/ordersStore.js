import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,

  // Fetch orders for the logged-in user
  fetchOrders: async (userId) => {
    if (!userId) return
    set({ loading: true })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!error) set({ orders: data || [] })
    set({ loading: false })
  },

  // Place a new order — called after successful payment
  placeOrder: async ({ userId, items, total, address, paymentMethod, razorpayOrderId }) => {
    const orderNumber = 'NP-' + Date.now().toString().slice(-6)
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        items,           // JSON array: [{ name, qty, price, variant }]
        total,
        address,         // JSON: { name, line1, city, state, pincode, phone }
        payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId || null,
        status: 'confirmed',
      })
      .select()
      .single()

    if (error) return { error: error.message }
    set({ orders: [data, ...get().orders] })
    return { success: true, order: data }
  },
}))
