import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

const WHATSAPP_NUMBER = '6289672874600'
const WA_MESSAGE =
  'Halo Admin Dampingcare.\n\nSaya telah mengisi formulir Deal to Pay dan telah membuat ringkasan pengajuan.\n\nMohon dipertimbangkan. Terima kasih.'

const FIELDS = [
  { name: 'clientName', label: 'Nama klien/keluarga klien', required: true, type: 'text', icon: 'user' },
  { name: 'waNumber', label: 'Nomor WhatsApp', required: true, type: 'tel', icon: 'phone', inputMode: 'tel' },
  { name: 'patientName', label: 'Nama pasien', required: true, type: 'text', icon: 'heart' },
  { name: 'patientAge', label: 'Usia pasien', required: false, type: 'number', icon: 'calendar' },
  { name: 'relation', label: 'Hubungan dengan pasien', required: false, type: 'text', icon: 'users' },
  { name: 'serviceType', label: 'Jenis layanan', required: false, type: 'text', icon: 'clipboard' },
  { name: 'hospital', label: 'Rumah Sakit/Lokasi', required: false, type: 'text', icon: 'pin' },
  { name: 'startDate', label: 'Tanggal mulai', required: false, type: 'date', icon: 'calendar' },
  { name: 'duration', label: 'Estimasi durasi', required: false, type: 'text', icon: 'clock' },
  { name: 'normalPrice', label: 'Harga normal (opsional)', required: false, type: 'text', icon: 'tag' },
  { name: 'proposedAmount', label: 'Nominal yang mampu dibayarkan', required: true, type: 'text', icon: 'wallet' },
  { name: 'reason', label: 'Alasan pengajuan', required: true, type: 'textarea', icon: 'doc' },
  { name: 'notes', label: 'Catatan tambahan', required: false, type: 'textarea', icon: 'note' },
]

const ICONS = {
  user: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  phone: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  heart: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  calendar: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  users: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  clipboard: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
  ),
  pin: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  clock: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  tag: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  wallet: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
  ),
  doc: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  note: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
  ),
  check: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  shield: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  sparkle: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.8L19.6 9.6 13.8 11.4 12 17.2l-1.8-5.8L4.4 9.6l5.8-1.8z"/></svg>
  ),
}

function formatRupiah(val) {
  if (!val) return ''
  const num = String(val).replace(/[^\d]/g, '')
  if (!num) return ''
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

function generateId() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `DTP-${ymd}-${seq}`
}

function formatDateTime(d) {
  const pad = (n) => String(n).padStart(2, '0')
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())} WIB`
}

export default function App() {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [agree, setAgree] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const cardRef = useRef(null)

  const update = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const validate = () => {
    const e = {}
    FIELDS.forEach((f) => {
      if (f.required && !String(form[f.name] || '').trim()) {
        e[f.name] = 'Wajib diisi'
      }
    })
    if (form.waNumber && !/^[0-9+\s-]{8,}$/.test(form.waNumber)) {
      e.waNumber = 'Nomor tidak valid'
    }
    if (!agree) setAgreeError(true)
    else setAgreeError(false)
    setErrors(e)
    return Object.keys(e).length === 0 && agree
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      const firstErr = document.querySelector('.field-error, .agree-error')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    const now = new Date()
    const sub = {
      id: generateId(),
      datetime: formatDateTime(now),
      data: { ...form },
    }
    setSubmission(sub)
    // wait for card to render
    await new Promise((r) => setTimeout(r, 120))
    try {
      const node = cardRef.current
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      setPreview(dataUrl)
      // open WhatsApp
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`
      window.open(url, '_blank')
      setTimeout(() => setShowInstructions(true), 600)
    } catch (err) {
      console.error(err)
      alert('Gagal membuat gambar pengajuan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const downloadPng = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = `pengajuan-${submission?.id || 'deal-to-pay'}.png`
    a.click()
  }

  const reset = () => {
    setForm({})
    setErrors({})
    setAgree(false)
    setPreview(null)
    setSubmission(null)
    setShowInstructions(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addRipple = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ink = document.createElement('span')
    ink.className = 'ripple-ink'
    ink.style.width = ink.style.height = size + 'px'
    ink.style.left = e.clientX - rect.left - size / 2 + 'px'
    ink.style.top = e.clientY - rect.top - size / 2 + 'px'
    btn.appendChild(ink)
    setTimeout(() => ink.remove(), 600)
  }

  return (
    <div className="app-shell">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Header */}
      <header className="header fade-up">
        <div className="header-icon">{ICONS.clipboard(28)}</div>
        <h1 className="header-title">Deal to Pay</h1>
        <p className="header-sub">
          Ajukan penyesuaian biaya layanan sesuai kondisi dan kemampuan pembayaran Anda. Setiap pengajuan akan dipertimbangkan oleh tim Dampingcare dan tidak menjamin persetujuan.
        </p>
      </header>

      {/* Form card */}
      <main className="content">
        <form className="card form-card fade-up" style={{ animationDelay: '0.1s' }} onSubmit={handleSubmit} noValidate>
          <div className="card-head">
            <span className="card-badge">{ICONS.sparkle(14)} Formulir Pengajuan</span>
          </div>

          {FIELDS.map((f, i) => (
            <div key={f.name} className={`field ${errors[f.name] ? 'field-error' : ''}`} style={{ animationDelay: `${0.12 + i * 0.03}s` }}>
              <label htmlFor={f.name}>
                <span className="field-icon">{ICONS[f.icon](16)}</span>
                {f.label}
                {f.required && <span className="req"> *</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  id={f.name}
                  rows={3}
                  value={form[f.name] || ''}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.label}
                  className={errors[f.name] ? 'input err' : 'input'}
                />
              ) : (
                <input
                  id={f.name}
                  type={f.type}
                  inputMode={f.inputMode}
                  value={form[f.name] || ''}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.label}
                  className={errors[f.name] ? 'input err' : 'input'}
                />
              )}
              {errors[f.name] && <span className="err-msg">{errors[f.name]}</span>}
            </div>
          ))}

          {/* Agreement */}
          <div className={`agree ${agreeError ? 'agree-error' : ''}`}>
            <button
              type="button"
              className={`check-box ${agree ? 'checked' : ''}`}
              onClick={() => { setAgree(!agree); setAgreeError(false) }}
              aria-pressed={agree}
            >
              {agree && ICONS.check(14)}
            </button>
            <span className="agree-text">
              Saya telah membaca dan menyetujui syarat &amp; ketentuan Deal to Pay.
            </span>
          </div>
          {agreeError && <span className="err-msg agree-err-msg">Anda harus menyetujui syarat &amp; ketentuan.</span>}

          <button
            type="submit"
            className="btn-primary ripple"
            disabled={submitting}
            onMouseDown={addRipple}
          >
            {submitting ? (
              <><span className="spinner" /> Membuat ringkasan…</>
            ) : (
              <>{ICONS.shield(18)} Kirim Pengajuan</>
            )}
          </button>
        </form>

        {/* Hidden card for rendering */}
        {submission && (
          <div className="render-wrap" aria-hidden="true">
            <div className="png-card" ref={cardRef}>
              <div className="png-card-inner">
                <div className="png-top">
                  <div className="png-logo">{ICONS.clipboard(26)}</div>
                  <div className="png-brand">Dampingcare</div>
                </div>
                <h2 className="png-title">DEAL TO PAY</h2>
                <p className="png-subtitle">Lembar Pengajuan Penyesuaian Biaya Layanan</p>

                <div className="png-id-row">
                  <div>
                    <span className="png-id-label">ID Pengajuan</span>
                    <span className="png-id-val">{submission.id}</span>
                  </div>
                  <div className="png-id-right">
                    <span className="png-id-label">Waktu</span>
                    <span className="png-id-val">{submission.datetime}</span>
                  </div>
                </div>

                <div className="png-divider" />

                {FIELDS.map((f) => {
                  const val = submission.data[f.name]
                  if (!val) return null
                  return (
                    <div className="png-row" key={f.name}>
                      <span className="png-row-icon">{ICONS[f.icon](15)}</span>
                      <div className="png-row-body">
                        <span className="png-row-label">{f.label.replace(' (opsional)', '')}</span>
                        <span className="png-row-val">{val}</span>
                      </div>
                    </div>
                  )
                })}

                <div className="png-divider" />

                <div className="png-status">
                  <span className="png-status-dot" />
                  <div>
                    <span className="png-status-label">Status</span>
                    <span className="png-status-val">Menunggu Pertimbangan Dampingcare</span>
                  </div>
                </div>

                <div className="png-footer">
                  <span className="png-footer-line">Dokumen ini dibuat secara otomatis melalui formulir Deal to Pay.</span>
                  <span className="png-footer-thanks">Terima kasih atas kepercayaan Anda.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview modal */}
        {preview && (
          <div className="modal fade-in" role="dialog" aria-modal="true">
            <div className="modal-card pop">
              <div className="modal-head">
                <span className="modal-badge">{ICONS.sparkle(14)} Ringkasan Pengajuan</span>
                <button className="modal-close" onClick={() => setPreview(null)} aria-label="Tutup">×</button>
              </div>
              <img src={preview} alt="Ringkasan pengajuan" className="preview-img" />
              <div className="modal-actions">
                <button className="btn-ghost ripple" onMouseDown={addRipple} onClick={downloadPng}>
                  Unduh PNG
                </button>
                <a
                  className="btn-wa ripple"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`}
                  target="_blank"
                  rel="noreferrer"
                  onMouseDown={addRipple}
                >
                  Buka WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {showInstructions && (
          <div className="instructions fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="inst-icon">{ICONS.shield(22)}</div>
            <p className="inst-text">
              Silakan lampirkan gambar pengajuan yang telah dibuat sebelum mengirim pesan.
            </p>
            <div className="inst-actions">
              <button className="btn-ghost-sm ripple" onMouseDown={addRipple} onClick={() => setPreview(preview)}>
                Lihat Gambar
              </button>
              <button className="btn-text ripple" onMouseDown={addRipple} onClick={reset}>
                Buat Pengajuan Baru
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer fade-in">
        <span>© {new Date().getFullYear()} Dampingcare · Deal to Pay</span>
      </footer>
    </div>
  )
}
