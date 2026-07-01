import { useState } from 'react'

export default function LangSwitcher() {
	const [lang, setLang] = useState<'pl' | 'en'>('pl')

	function toggle() {
		const next: 'pl' | 'en' = lang === 'pl' ? 'en' : 'pl'
		setLang(next)
		document.documentElement.lang = next
		document.querySelectorAll<HTMLElement>('[data-pl]').forEach((el) => {
			const text = next === 'pl' ? el.dataset.pl : el.dataset.en
			if (text !== undefined) el.textContent = text
		})
		document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: next } }))
	}

	return (
		<button onClick={toggle} style={{
			color: 'var(--muted)',
			background: 'none',
			cursor: 'pointer',
			fontSize: '12px',
			letterSpacing: '0.5px',
			border: '1px solid var(--border-med)',
			padding: '5px 12px',
			borderRadius: '100px',
			fontFamily: "'DM Sans', sans-serif",
		}}>
			{lang === 'pl' ? 'PL / EN' : 'EN / PL'}
		</button>
	)
}
