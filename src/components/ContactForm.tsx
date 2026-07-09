import { useState, useEffect } from 'react'
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}

export default function ContactForm({ pl, en }: Props) {
	const [lang, setLang] = useState<'pl' | 'en'>('pl')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

	useEffect(() => {
		const handler = (e: Event) => {
			setLang((e as CustomEvent<{ lang: 'pl' | 'en' }>).detail.lang)
		}
		document.addEventListener('langchange', handler)
		return () => document.removeEventListener('langchange', handler)
	}, [])

	const t = lang === 'pl' ? pl : en

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setStatus('sending')
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, phone, message }),
			})
			if (res.ok) {
				setStatus('done')
			} else {
				setStatus('error')
			}
		} catch {
			setStatus('error')
		}
	}

	const inputStyle: React.CSSProperties = {
		background: 'rgba(255,255,255,0.05)',
		border: '1px solid rgba(255,255,255,0.12)',
		borderRadius: 11,
		padding: '14px 16px',
		color: '#fff',
		fontSize: 16,
		fontFamily: "'DM Sans', sans-serif",
		outline: 'none',
		width: '100%',
	}

	const labelStyle: React.CSSProperties = {
		fontSize: 13,
		color: 'rgba(255,255,255,0.65)',
		display: 'block',
		marginBottom: 7,
	}

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				background: 'var(--ink)',
				borderRadius: 22,
				padding: 34,
			}}
		>
			{status === 'done' ? (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<p style={{ color: '#fff', fontSize: 16, margin: '0 0 20px' }}>
						{t.successMsg}
					</p>
					<button
						type="button"
						onClick={() => {
							setName('')
							setEmail('')
							setPhone('')
							setMessage('')
							setStatus('idle')
						}}
						style={{
							background: 'transparent',
							color: '#fff',
							border: '1px solid rgba(255,255,255,0.3)',
							padding: '10px 22px',
							borderRadius: 12,
							fontSize: 14,
							fontFamily: "'DM Sans', sans-serif",
							cursor: 'pointer',
						}}
					>
						{lang === 'pl' ? 'Wyślij kolejną wiadomość' : 'Send another message'}
					</button>
				</div>
			) : status === 'error' ? (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<p style={{ color: '#ff6b6b', fontSize: 16, margin: '0 0 20px' }}>
						{lang === 'pl' ? 'Błąd wysyłania. Spróbuj ponownie.' : 'Send error. Please try again.'}
					</p>
					<button
						type="button"
						onClick={() => setStatus('idle')}
						style={{
							background: 'transparent',
							color: '#fff',
							border: '1px solid rgba(255,255,255,0.3)',
							padding: '10px 22px',
							borderRadius: 12,
							fontSize: 14,
							fontFamily: "'DM Sans', sans-serif",
							cursor: 'pointer',
						}}
					>
						{lang === 'pl' ? 'Wróć do formularza' : 'Back to form'}
					</button>
				</div>
			) : (
				<>
					<div style={{ marginBottom: 20 }}>
						<label style={labelStyle}>{t.fName}</label>
						<input
							required
							type="text"
							placeholder={t.fNameP}
							value={name}
							onChange={(e) => setName(e.target.value)}
							style={inputStyle}
						/>
					</div>
					<div style={{ marginBottom: 20 }}>
						<label style={labelStyle}>Email</label>
						<input
							required
							type="email"
							placeholder={t.fEmailP}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={inputStyle}
						/>
					</div>
					<div style={{ marginBottom: 20 }}>
						<label style={labelStyle}>
							{t.fPhone} <span style={{ opacity: 0.5 }}>({t.fOptional})</span>
						</label>
						<input
							type="tel"
							placeholder={t.fPhoneP}
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							style={inputStyle}
						/>
					</div>
					<div style={{ marginBottom: 26 }}>
						<label style={labelStyle}>{t.fMsg}</label>
						<textarea
							required
							placeholder={t.fMsgP}
							rows={4}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							style={{ ...inputStyle, resize: 'none' }}
						/>
					</div>
					<button
						type="submit"
						disabled={status === 'sending'}
						style={{
							background: 'var(--accent)',
							color: '#fff',
							border: 'none',
							padding: '15px 28px',
							borderRadius: 12,
							fontSize: 15,
							fontWeight: 600,
							fontFamily: "'DM Sans', sans-serif",
							cursor: status === 'sending' ? 'not-allowed' : 'pointer',
							width: '100%',
							opacity: status === 'sending' ? 0.7 : 1,
						}}
					>
						{status === 'sending' ? t.sendingLabel : t.send}
					</button>
				</>
			)}
		</form>
	)
}
