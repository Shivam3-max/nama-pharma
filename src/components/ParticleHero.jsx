import { useEffect, useRef } from 'react'

export default function ParticleHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let mouse = { x: -999, y: -999 }

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    })
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999 })

    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x    = Math.random() * canvas.width
        this.y    = initial ? Math.random() * canvas.height : canvas.height + 10
        this.size = Math.random() * 2 + 0.5
        this.vx   = (Math.random() - 0.5) * 0.3
        this.vy   = -(Math.random() * 0.4 + 0.15)
        this.life = 0
        this.maxLife = Math.random() * 400 + 200
        // warm gold & sage tones on light bg
        const cols = ['184,146,42', '212,168,67', '74,103,65', '160,120,32', '107,143,99']
        this.color = cols[Math.floor(Math.random() * cols.length)]
        this.opacity = Math.random() * 0.45 + 0.1
      }
      update() {
        this.life++
        if (this.life > this.maxLife) { this.reset(); return }

        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 120) {
          this.vx += dx * 0.0008
          this.vy += dy * 0.0008
        }

        this.x += this.vx
        this.y += this.vy

        const p = this.life / this.maxLife
        this.curOpacity = p < 0.15 ? (p / 0.15) * this.opacity
          : p > 0.8  ? ((1 - p) / 0.2) * this.opacity
          : this.opacity

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.curOpacity
        ctx.shadowBlur = 4
        ctx.shadowColor = `rgba(${this.color},0.6)`
        ctx.fillStyle   = `rgba(${this.color},1)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 70) {
            ctx.save()
            ctx.globalAlpha = (1 - d/70) * 0.1
            ctx.strokeStyle = 'rgba(184,146,42,1)'
            ctx.lineWidth   = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    for (let i = 0; i < 90; i++) {
      const p = new Particle()
      p.y    = Math.random() * canvas.height
      p.life = Math.floor(Math.random() * p.maxLife)
      particles.push(p)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawConnections()
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.7 }} />
  )
}
