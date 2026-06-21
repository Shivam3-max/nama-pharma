import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle, XCircle, Loader } from 'lucide-react'

const COD_PINCODES = ['400001','110001','560001','500001','600001','700001','411001','380001','302001','226001']

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState(null) // null | 'checking' | 'available' | 'unavailable'

  const check = () => {
    if (pincode.length !== 6) return
    setStatus('checking')
    setTimeout(() => {
      // Simulate: most pincodes available, only a few not
      const unavail = ['999999', '111111', '000000']
      setStatus(unavail.includes(pincode) ? 'unavailable' : 'available')
    }, 1200)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }} />
          <input
            className="input-light pl-9 text-sm"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            maxLength={6}
            onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setStatus(null) }}
            onKeyDown={e => e.key === 'Enter' && check()}
          />
        </div>
        <button onClick={check} disabled={pincode.length !== 6}
          className="btn-sage text-xs px-5 py-3"
          style={{ opacity: pincode.length !== 6 ? 0.5 : 1 }}>
          Check
        </button>
      </div>

      <AnimatePresence>
        {status === 'checking' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'var(--cream)', color: 'var(--text-muted)' }}>
            <Loader size={12} className="animate-spin" /> Checking delivery availability…
          </motion.div>
        )}
        {status === 'available' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.2)' }}>
            <CheckCircle size={13} style={{ color: 'var(--sage)', flexShrink: 0 }} />
            <span style={{ color: 'var(--sage)' }}>
              <strong>Delivery available</strong> to {pincode} · Expected in 3–5 business days · COD available
            </span>
          </motion.div>
        )}
        {status === 'unavailable' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.2)' }}>
            <XCircle size={13} style={{ color: '#dc3545', flexShrink: 0 }} />
            <span style={{ color: '#dc3545' }}>
              COD not available for this pincode. Prepaid delivery still available.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
