# Portfolio Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować kompletne portfolio one-pager (PL/EN) w Astro na podstawie design handoff z `design_handoff_portfolio/`.

**Architecture:** Statyczny Astro site z dwoma wyspami React: `LangSwitcher` (przełącza język przez manipulację DOM) i `ContactForm` (wysyła przez Netlify Forms via fetch). Każdy tłumaczalny element HTML ma atrybuty `data-pl`/`data-en`; po przełączeniu języka island chodzi po `[data-pl]` i podmienia `textContent`. Scroll reveal przez IntersectionObserver w globalnym skrypcie.

**Tech Stack:** Astro 7, React 18, TypeScript strict, Google Fonts (Playfair Display + DM Sans), Netlify Forms

## Global Constraints

- Indentacja: taby
- Cudzysłowy: pojedyncze
- Język domyślny: PL (EN przez toggle)
- Kolor akcentu: `#214eb8`
- Bg: `#f4f1eb`, surface: `#ffffff`, text: `#0f1629`
- Font display: `'Playfair Display', serif`
- Font body: `'DM Sans', sans-serif`
- Sekcje: padding 84–104px góra/dół × 56px boki, max-width 1280px
- Border-radius: pills 100px, karty 12px, karty realizacji 18px, formularz 22px
- `astro.config.mjs` i `src/i18n/copy.ts` już gotowe (nie ruszać)
- Logo w `public/logo.svg` już skopiowane
- Netlify Forms: ukryty statyczny formularz w index.astro + fetch POST z React

---

## File Map

| Plik | Status | Odpowiedzialność |
|------|--------|-----------------|
| `astro.config.mjs` | ✅ gotowe | React integration |
| `src/i18n/copy.ts` | ✅ gotowe | Wszystkie tłumaczenia PL/EN |
| `public/logo.svg` | ✅ gotowe | Favicon |
| `src/layouts/Layout.astro` | do stworzenia | HTML shell, fonty, CSS vars, scroll reveal, favicon |
| `src/components/Nav.astro` | do stworzenia | Sticky nav, linki kotwic, slot dla LangSwitcher |
| `src/components/LangSwitcher.tsx` | do stworzenia | React island: toggle PL/EN, DOM walk, CustomEvent |
| `src/components/Hero.astro` | do stworzenia | Intro, zielona kropka, H1, CTA |
| `src/components/Stats.astro` | do stworzenia | 4 statystyki z pionowymi separatorami |
| `src/components/Projects.astro` | do stworzenia | Grid 2×2 kart demo z browser mockupem |
| `src/components/Services.astro` | do stworzenia | 4 karty usług 2×2 |
| `src/components/About.astro` | do stworzenia | Tekst o mnie + chipy technologii |
| `src/components/CodeEditor.astro` | do stworzenia | Animacja pisania kodu (setInterval + DOM) |
| `src/components/WpVsAstro.astro` | do stworzenia | Karta WP (chaos wtyczek) vs karta Astro (lista ✓) |
| `src/components/Pricing.astro` | do stworzenia | 3 karty cennika, środkowa wyróżniona |
| `src/components/Reviews.astro` | do stworzenia | 2 karty cytatów (przykładowe) |
| `src/components/Contact.astro` | do stworzenia | Dane kontaktowe + slot dla ContactForm |
| `src/components/ContactForm.tsx` | do stworzenia | React island: formularz Netlify Forms |
| `src/components/Footer.astro` | do stworzenia | Imię, copyright, label języka |
| `src/pages/index.astro` | do aktualizacji | Składa wszystko + ukryty formularz Netlify |

---

## Task 1: Layout.astro — shell, fonty, CSS vars, scroll reveal

**Files:**
- Create: `src/layouts/Layout.astro`

**Interfaces:**
- Produces: `<Layout title="">` — wrapper z `<slot />` w body

- [ ] **Krok 1: Utwórz plik**

```astro
---
interface Props {
	title: string
}
const { title } = Astro.props
---

<html lang="pl">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
		<link rel="icon" type="image/svg+xml" href="/logo.svg" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
		<link
			href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
			rel="stylesheet"
		/>
	</head>
	<body>
		<slot />
	</body>
</html>

<style is:global>
	*, *::before, *::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:root {
		--bg: #f4f1eb;
		--surface: #ffffff;
		--text: #0f1629;
		--muted: rgba(15, 22, 41, 0.55);
		--muted-light: rgba(15, 22, 41, 0.45);
		--border: rgba(15, 22, 41, 0.08);
		--border-med: rgba(15, 22, 41, 0.12);
		--accent: #214eb8;
		--chip: #eef2ff;
		--ink: #0f1629;
		--display: 'Playfair Display', serif;
	}

	body {
		background: var(--bg);
		color: var(--text);
		font-family: 'DM Sans', sans-serif;
		min-height: 100vh;
	}

	[data-reveal] {
		opacity: 0;
		transform: translateY(28px);
		transition:
			opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity, transform;
	}

	[data-reveal-d='1'] { transition-delay: 0.08s; }
	[data-reveal-d='2'] { transition-delay: 0.16s; }
	[data-reveal-d='3'] { transition-delay: 0.24s; }

	@keyframes blinkCursor {
		0%, 49% { opacity: 1; }
		50%, 100% { opacity: 0; }
	}

	.code-cursor {
		display: inline-block;
		animation: blinkCursor 1s steps(1) infinite;
	}
</style>

<script>
	document.addEventListener('DOMContentLoaded', () => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const el = entry.target as HTMLElement
						el.style.opacity = '1'
						el.style.transform = 'none'
						observer.unobserve(el)
					}
				})
			},
			{ threshold: 0.08 }
		)
		document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
	})
</script>
```

- [ ] **Krok 2: Weryfikacja**

Tymczasowo podmień `src/pages/index.astro` żeby używał Layout i sprawdź że strona się ładuje bez błędów.

- [ ] **Krok 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(layout): add base layout with fonts, CSS vars, scroll reveal"
```

---

## Task 2: Nav.astro + LangSwitcher.tsx

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/LangSwitcher.tsx`

**Interfaces:**
- Consumes: `LangCopy` z `src/i18n/copy.ts`
- Produces: `<Nav pl en>` z named slot `lang-switcher`; `<LangSwitcher client:load />`

- [ ] **Krok 1: Utwórz Nav.astro**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<nav>
	<a href="#" class="nav-home">home</a>
	<div class="nav-links">
		<a href="#realizacje" data-pl={pl.navWork} data-en={en.navWork}>{pl.navWork}</a>
		<a href="#uslugi" data-pl={pl.navServ} data-en={en.navServ}>{pl.navServ}</a>
		<a href="#cennik" data-pl={pl.navPrice} data-en={en.navPrice}>{pl.navPrice}</a>
		<a href="#omnie" data-pl={pl.navAbout} data-en={en.navAbout}>{pl.navAbout}</a>
		<a href="#kontakt" data-pl={pl.navContact} data-en={en.navContact}>{pl.navContact}</a>
		<slot name="lang-switcher" />
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 56px;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: var(--bg);
		z-index: 50;
	}

	.nav-home {
		color: var(--text);
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
	}

	.nav-links {
		display: flex;
		gap: 26px;
		align-items: center;
	}

	.nav-links a {
		color: var(--muted);
		text-decoration: none;
		font-size: 14px;
	}

	.nav-links a:hover {
		color: var(--text);
	}
</style>
```

- [ ] **Krok 2: Utwórz LangSwitcher.tsx**

```tsx
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
		window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: next } }))
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
```

- [ ] **Krok 3: Sprawdź w przeglądarce**

Uruchom `astro dev --background`, otwórz localhost. Nav powinien być sticky, przycisk języka widoczny.

- [ ] **Krok 4: Commit**

```bash
git add src/components/Nav.astro src/components/LangSwitcher.tsx
git commit -m "feat(nav): add sticky nav with language switcher island"
```

---

## Task 3: Hero.astro

**Files:**
- Create: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `pl: LangCopy`, `en: LangCopy`
- Produces: `<Hero pl en />`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section class="hero">
	<div data-reveal class="hero-status">
		<span class="dot"></span>
		<span data-pl={pl.status} data-en={en.status}>{pl.status}</span>
	</div>
	<div data-reveal data-reveal-d="1" class="hero-name">Miłosz Bembnowicz</div>
	<h1 data-reveal data-reveal-d="2">
		<span data-pl={pl.h1a} data-en={en.h1a}>{pl.h1a}</span>
		{' '}
		<span class="accent" data-pl={pl.h1b} data-en={en.h1b}>{pl.h1b}</span>
		{' '}
		<span data-pl={pl.h1c} data-en={en.h1c}>{pl.h1c}</span>
	</h1>
	<div data-reveal data-reveal-d="3" class="hero-cta">
		<a href="#kontakt" class="btn-primary" data-pl={pl.cta1} data-en={en.cta1}>{pl.cta1}</a>
		<a href="#realizacje" class="btn-text">
			<span data-pl={pl.cta2} data-en={en.cta2}>{pl.cta2}</span> ↓
		</a>
	</div>
</section>

<style>
	.hero {
		padding: 104px 56px 88px;
		max-width: 880px;
	}

	.hero-status {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 36px;
		font-size: 13px;
		color: var(--muted);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #22c55e;
		flex-shrink: 0;
	}

	.hero-name {
		font-family: var(--display);
		font-size: 21px;
		font-weight: 600;
		margin-bottom: 26px;
	}

	h1 {
		font-family: var(--display);
		font-size: 54px;
		font-weight: 600;
		line-height: 1.12;
		letter-spacing: -0.5px;
		margin: 0 0 42px;
	}

	.accent {
		color: var(--accent);
	}

	.hero-cta {
		display: flex;
		gap: 14px;
		align-items: center;
	}

	.btn-primary {
		background: var(--accent);
		color: #fff;
		text-decoration: none;
		padding: 14px 30px;
		border-radius: 100px;
		font-size: 15px;
		font-weight: 500;
	}

	.btn-text {
		color: var(--muted);
		text-decoration: none;
		font-size: 15px;
	}
</style>
```

- [ ] **Krok 2: Sprawdź wizualnie** — hero wyrównany do lewej, H1 54px, zielona kropka, przyciski.

- [ ] **Krok 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): add hero section with status dot and CTA"
```

---

## Task 4: Stats.astro

**Files:**
- Create: `src/components/Stats.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<div class="stats">
	<div class="stats-inner">
		<div data-reveal class="stat">
			<div class="stat-num accent">1+</div>
			<div class="stat-label" data-pl={pl.s1} data-en={en.s1}>{pl.s1}</div>
		</div>
		<div class="sep"></div>
		<div data-reveal data-reveal-d="1" class="stat">
			<div class="stat-num">100%</div>
			<div class="stat-label" data-pl={pl.s2} data-en={en.s2}>{pl.s2}</div>
		</div>
		<div class="sep"></div>
		<div data-reveal data-reveal-d="2" class="stat">
			<div class="stat-num">∞</div>
			<div class="stat-label" data-pl={pl.s3} data-en={en.s3}>{pl.s3}</div>
		</div>
		<div class="sep"></div>
		<div data-reveal data-reveal-d="3" class="stat">
			<div class="stat-num accent">1,5k+</div>
			<div class="stat-label" data-pl={pl.s4} data-en={en.s4}>{pl.s4}</div>
		</div>
	</div>
</div>

<style>
	.stats {
		background: var(--surface);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 26px 56px;
	}

	.stats-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		align-items: center;
	}

	.stat {
		display: flex;
		gap: 14px;
		align-items: center;
		flex: 1;
		padding: 0 32px;
	}

	.stat:first-child { padding-left: 0; }
	.stat:last-child { padding-right: 0; }

	.stat-num {
		font-family: var(--display);
		font-size: 32px;
		font-weight: 700;
		line-height: 1;
	}

	.accent { color: var(--accent); }

	.stat-label {
		font-size: 12px;
		color: rgba(15, 22, 41, 0.4);
		line-height: 1.4;
		white-space: pre-line;
	}

	.sep {
		width: 1px;
		height: 32px;
		background: var(--border);
		flex-shrink: 0;
	}
</style>
```

- [ ] **Krok 2: Sprawdź** — 4 statystyki w rzędzie, pionowe separatory, `1+` i `1,5k+` w kolorze akcentu.

- [ ] **Krok 3: Commit**

```bash
git add src/components/Stats.astro
git commit -m "feat(stats): add stats strip with separators"
```

---

## Task 5: Projects.astro

**Files:**
- Create: `src/components/Projects.astro`

Uwaga: hover overlay działa CSS `:hover` (nie onMouseEnter — jesteśmy w czystym Astro, nie design tool).

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props

const projects = [
	{ color: '#214eb8', domain: 'kancelarialex.pl', name: 'Kancelaria Lex', descPl: pl.p1, descEn: en.p1, mockupAccent: '#214eb8', mockupBg: '#eeebe4', mockupLine: '#e5e1da' },
	{ color: '#d97642', domain: 'trattoriabella.pl', name: 'Trattoria Bella', descPl: pl.p2, descEn: en.p2, mockupAccent: '#d97642', mockupBg: '#f3e7df', mockupLine: '#ecddd2' },
	{ color: '#3f9b72', domain: 'warsztatmechanika.pl', name: 'Warsztat Mechanika', descPl: pl.p3, descEn: en.p3, mockupAccent: '#3f9b72', mockupBg: '#e3efe8', mockupLine: '#d8e8de' },
	{ color: '#2b2a3d', domain: 'studioglow.pl', name: 'Studio Glow', descPl: pl.p4, descEn: en.p4, mockupAccent: '#2b2a3d', mockupBg: '#e7e6ee', mockupLine: '#dddce8' },
]
---

<section id="realizacje" class="projects">
	<div class="projects-header">
		<div data-reveal>
			<div class="eyebrow" data-pl={pl.workEy} data-en={en.workEy}>{pl.workEy}</div>
			<h2 class="section-title" data-pl={pl.workTitle} data-en={en.workTitle}>{pl.workTitle}</h2>
			<p class="section-note" data-pl={pl.workNote} data-en={en.workNote}>{pl.workNote}</p>
		</div>
		<a href="#" data-reveal data-reveal-d="1" class="see-all">
			<span data-pl={pl.workAll} data-en={en.workAll}>{pl.workAll}</span>
			<span class="see-all-icon">↗</span>
		</a>
	</div>

	<div class="projects-grid">
		{projects.map((p, i) => (
			<a href="#" class="project-card" data-reveal data-reveal-d={i % 2 === 1 ? '1' : undefined}>
				<div class="card-img" style={`background:${p.color}`}>
					<span class="demo-badge">DEMO</span>
					<div class="preview-overlay">
						<span class="preview-label">
							<span data-pl={pl.previewCta} data-en={en.previewCta}>{pl.previewCta}</span> ↗
						</span>
					</div>
					<div class="browser-window">
						<div class="browser-bar">
							<span class="dot red"></span>
							<span class="dot yellow"></span>
							<span class="dot green"></span>
						</div>
						<div class="browser-url-row">
							<div class="browser-url">{p.domain}</div>
						</div>
						<div class="browser-content">
							<div class="mock-hero" style={`background:repeating-linear-gradient(135deg,${p.mockupBg},${p.mockupBg} 7px,${p.mockupLine} 7px,${p.mockupLine} 14px)`}></div>
							<div class="mock-line" style={`background:${p.mockupLine};width:74%`}></div>
							<div class="mock-line" style={`background:${p.mockupLine};width:56%`}></div>
							<div class="mock-btn" style={`background:${p.mockupAccent}`}></div>
						</div>
					</div>
				</div>
				<div class="card-meta">
					<div class="card-name">{p.name}</div>
					<div class="card-desc" data-pl={p.descPl} data-en={p.descEn}>{p.descPl}</div>
				</div>
			</a>
		))}
	</div>
</section>

<style>
	.projects {
		padding: 88px 56px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.projects-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 48px;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
		font-weight: 600;
	}

	.section-title {
		font-family: var(--display);
		font-size: 46px;
		font-weight: 600;
		letter-spacing: -0.5px;
		margin: 0 0 10px;
		line-height: 1;
	}

	.section-note {
		font-size: 14px;
		color: var(--muted-light);
		max-width: 420px;
	}

	.see-all {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-size: 15px;
		color: var(--text);
		text-decoration: none;
		font-weight: 500;
		white-space: nowrap;
	}

	.see-all-icon {
		width: 30px;
		height: 30px;
		border: 1px solid var(--border-med);
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
	}

	.project-card {
		display: flex;
		flex-direction: column;
		gap: 18px;
		text-decoration: none;
		color: inherit;
		transition: transform 0.25s ease;
	}

	.project-card:hover {
		transform: translateY(-4px);
	}

	.card-img {
		border-radius: 18px;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 34px 34px 0;
		position: relative;
		transition: box-shadow 0.25s ease;
	}

	.project-card:hover .card-img {
		box-shadow: 0 16px 36px rgba(15, 22, 41, 0.22);
	}

	.demo-badge {
		position: absolute;
		top: 16px;
		left: 16px;
		background: rgba(255, 255, 255, 0.92);
		color: var(--ink);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.5px;
		padding: 4px 11px;
		border-radius: 100px;
		z-index: 2;
	}

	.preview-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(15, 22, 41, 0.62);
		opacity: 0;
		transition: opacity 0.2s ease;
		z-index: 3;
	}

	.card-img:hover .preview-overlay {
		opacity: 1;
	}

	.preview-label {
		color: #fff;
		font-size: 14px;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 255, 255, 0.14);
		padding: 10px 20px;
		border-radius: 100px;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.browser-window {
		width: 86%;
		background: #fff;
		border-radius: 9px 9px 0 0;
		box-shadow: 0 22px 50px rgba(0, 0, 0, 0.26);
		overflow: hidden;
	}

	.browser-bar {
		background: #f0ede7;
		padding: 9px 12px;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.red { background: #ff6058; }
	.yellow { background: #ffbc2e; }
	.green { background: #29c942; }

	.browser-url-row {
		background: #fff;
		padding: 6px 12px 8px;
	}

	.browser-url {
		background: #f4f1eb;
		border-radius: 6px;
		padding: 5px 10px;
		font-size: 10px;
		color: rgba(15, 22, 41, 0.4);
	}

	.browser-content {
		padding: 10px 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.mock-hero {
		height: 44px;
		border-radius: 5px;
	}

	.mock-line {
		height: 8px;
		border-radius: 3px;
	}

	.mock-btn {
		height: 20px;
		width: 34%;
		border-radius: 100px;
		margin-top: 5px;
	}

	.card-meta { }

	.card-name {
		font-family: var(--display);
		font-size: 25px;
		font-weight: 600;
	}

	.card-desc {
		font-size: 14px;
		color: var(--muted-light);
		margin-top: 5px;
	}
</style>
```

- [ ] **Krok 2: Sprawdź** — grid 2×2, browser mockupy, hover unosi kartę, overlay na obrazku.

- [ ] **Krok 3: Commit**

```bash
git add src/components/Projects.astro
git commit -m "feat(projects): add projects grid with browser mockups and hover"
```

---

## Task 6: Services.astro

**Files:**
- Create: `src/components/Services.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section id="uslugi" class="services">
	<div class="services-inner">
		<div data-reveal class="services-header">
			<div class="eyebrow" data-pl={pl.servEy} data-en={en.servEy}>{pl.servEy}</div>
			<h2 class="section-title" data-pl={pl.servTitle} data-en={en.servTitle}>{pl.servTitle}</h2>
		</div>
		<div class="services-grid">
			<div data-reveal class="service-card border-accent">
				<div class="sv-title" data-pl={pl.sv1t} data-en={en.sv1t}>{pl.sv1t}</div>
				<div class="sv-desc" data-pl={pl.sv1d} data-en={en.sv1d}>{pl.sv1d}</div>
				<div class="sv-price" data-pl={pl.sv1p} data-en={en.sv1p}>{pl.sv1p}</div>
			</div>
			<div data-reveal data-reveal-d="1" class="service-card border-text">
				<div class="sv-title" data-pl={pl.sv2t} data-en={en.sv2t}>{pl.sv2t}</div>
				<div class="sv-desc" data-pl={pl.sv2d} data-en={en.sv2d}>{pl.sv2d}</div>
				<div class="sv-price" data-pl={pl.sv2p} data-en={en.sv2p}>{pl.sv2p}</div>
			</div>
			<div data-reveal class="service-card border-text">
				<div class="sv-title" data-pl={pl.sv3t} data-en={en.sv3t}>{pl.sv3t}</div>
				<div class="sv-desc" data-pl={pl.sv3d} data-en={en.sv3d}>{pl.sv3d}</div>
				<div class="sv-price" data-pl={pl.sv3p} data-en={en.sv3p}>{pl.sv3p}</div>
			</div>
			<div data-reveal data-reveal-d="1" class="service-card border-accent">
				<div class="sv-title" data-pl={pl.sv4t} data-en={en.sv4t}>{pl.sv4t}</div>
				<div class="sv-desc" data-pl={pl.sv4d} data-en={en.sv4d}>{pl.sv4d}</div>
				<div class="sv-price" data-pl={pl.sv4p} data-en={en.sv4p}>{pl.sv4p}</div>
			</div>
		</div>
	</div>
</section>

<style>
	.services {
		background: var(--surface);
		padding: 84px 56px;
	}

	.services-inner {
		max-width: 1280px;
		margin: 0 auto;
	}

	.services-header { margin-bottom: 44px; }

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 10px;
		font-weight: 600;
	}

	.section-title {
		font-family: var(--display);
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.5px;
		line-height: 1.05;
	}

	.services-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.service-card {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 30px;
		border-top-width: 3px;
	}

	.border-accent { border-top-color: var(--accent); }
	.border-text { border-top-color: var(--text); }

	.sv-title {
		font-family: var(--display);
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 9px;
	}

	.sv-desc {
		color: var(--muted);
		font-size: 14px;
		line-height: 1.65;
		margin-bottom: 16px;
	}

	.sv-price {
		font-size: 13px;
		font-weight: 600;
		color: var(--accent);
	}
</style>
```

- [ ] **Krok 2: Commit**

```bash
git add src/components/Services.astro
git commit -m "feat(services): add services grid with alternating top border"
```

---

## Task 7: About.astro + CodeEditor.astro

**Files:**
- Create: `src/components/About.astro`
- Create: `src/components/CodeEditor.astro`

Uwaga dot. CodeEditor: animacja pisania działa przez bezpośrednią manipulację DOM (`textContent` na spanach z `data-tok`) — NIE przez React state. Zapobiega to re-renderom które zerują scroll-reveal opacity.

- [ ] **Krok 1: Utwórz About.astro**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section id="omnie" class="about">
	<div data-reveal>
		<div class="eyebrow" data-pl={pl.aboutEy} data-en={en.aboutEy}>{pl.aboutEy}</div>
		<h2 class="about-title" data-pl={pl.aboutTitle} data-en={en.aboutTitle}>{pl.aboutTitle}</h2>
		<p class="about-p" data-pl={pl.about1} data-en={en.about1}>{pl.about1}</p>
		<p class="about-p" data-pl={pl.about2} data-en={en.about2}>{pl.about2}</p>
		<p class="about-p last" data-pl={pl.about3} data-en={en.about3}>{pl.about3}</p>
		<div class="chips">
			<span class="chip">Astro</span>
			<span class="chip">TypeScript</span>
			<span class="chip">Netlify</span>
			<span class="chip">PostgreSQL</span>
			<span class="chip">REST API</span>
		</div>
	</div>
</section>

<style>
	.about {
		padding: 92px 56px;
		max-width: 760px;
		margin: 0 auto;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 16px;
		font-weight: 600;
	}

	.about-title {
		font-family: var(--display);
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.5px;
		margin: 0 0 26px;
		line-height: 1.08;
	}

	.about-p {
		color: var(--muted);
		font-size: 16px;
		line-height: 1.75;
		margin: 0 0 16px;
	}

	.last { margin-bottom: 32px; }

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		background: var(--chip);
		color: var(--accent);
		font-size: 13px;
		padding: 6px 16px;
		border-radius: 100px;
		font-weight: 500;
	}
</style>
```

- [ ] **Krok 2: Utwórz CodeEditor.astro**

Struktura HTML: pre-tworzone spany `data-tok="lineIndex-tokenIndex"` z pustym textContent. Skrypt JS zapełnia je stopniowo przez `setInterval`.

Mapa kolorów tokenów (Night Owl): `p=#d6deeb, c=#7c8aa6, k=#c792ea, s=#c3e88d, b=#89ddff, t=#82aaff, a=#ffcb6b`

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<div class="editor-wrap">
	<p class="editor-caption" data-pl={pl.heroCodeCaption} data-en={en.heroCodeCaption}>{pl.heroCodeCaption}</p>
	<div class="editor" data-reveal>
		<div class="editor-titlebar">
			<span class="tb-dot tb-red"></span>
			<span class="tb-dot tb-yellow"></span>
			<span class="tb-dot tb-green"></span>
			<span class="editor-filename">Hero.astro</span>
		</div>
		<div class="editor-body">
			<!-- Line 0: --- -->
			<div class="code-line"><span data-tok="0-0" style="color:#d6deeb"></span></div>
			<!-- Line 1: // comment -->
			<div class="code-line"><span data-tok="1-0" style="color:#7c8aa6"></span></div>
			<!-- Line 2: const klient = "..." -->
			<div class="code-line">
				<span data-tok="2-0" style="color:#c792ea"></span>
				<span data-tok="2-1" style="color:#d6deeb"></span>
				<span data-tok="2-2" style="color:#d6deeb"></span>
				<span data-tok="2-3" style="color:#c3e88d"></span>
				<span data-tok="2-4" style="color:#d6deeb"></span>
			</div>
			<!-- Line 3: const stack = [...] -->
			<div class="code-line">
				<span data-tok="3-0" style="color:#c792ea"></span>
				<span data-tok="3-1" style="color:#d6deeb"></span>
				<span data-tok="3-2" style="color:#d6deeb"></span>
				<span data-tok="3-3" style="color:#c3e88d"></span>
				<span data-tok="3-4" style="color:#d6deeb"></span>
				<span data-tok="3-5" style="color:#c3e88d"></span>
				<span data-tok="3-6" style="color:#d6deeb"></span>
			</div>
			<!-- Line 4: --- -->
			<div class="code-line"><span data-tok="4-0" style="color:#d6deeb"></span></div>
			<!-- Line 5: empty -->
			<div class="code-line">&nbsp;</div>
			<!-- Line 6: <Layout client:load> -->
			<div class="code-line">
				<span data-tok="6-0" style="color:#89ddff"></span>
				<span data-tok="6-1" style="color:#82aaff"></span>
				<span data-tok="6-2" style="color:#ffcb6b"></span>
				<span data-tok="6-3" style="color:#89ddff"></span>
			</div>
			<!-- Line 7: <Hero tytul={klient} /> -->
			<div class="code-line">
				<span data-tok="7-0" style="color:#89ddff"></span>
				<span data-tok="7-1" style="color:#82aaff"></span>
				<span data-tok="7-2" style="color:#ffcb6b"></span>
				<span data-tok="7-3" style="color:#d6deeb"></span>
				<span data-tok="7-4" style="color:#89ddff"></span>
			</div>
			<!-- Line 8: <Uslugi dane={stack} /> -->
			<div class="code-line">
				<span data-tok="8-0" style="color:#89ddff"></span>
				<span data-tok="8-1" style="color:#82aaff"></span>
				<span data-tok="8-2" style="color:#ffcb6b"></span>
				<span data-tok="8-3" style="color:#d6deeb"></span>
				<span data-tok="8-4" style="color:#89ddff"></span>
			</div>
			<!-- Line 9: <Kontakt /> -->
			<div class="code-line">
				<span data-tok="9-0" style="color:#89ddff"></span>
				<span data-tok="9-1" style="color:#82aaff"></span>
				<span data-tok="9-2" style="color:#89ddff"></span>
			</div>
			<!-- Line 10: </Layout> -->
			<div class="code-line">
				<span data-tok="10-0" style="color:#89ddff"></span>
				<span data-tok="10-1" style="color:#82aaff"></span>
				<span data-tok="10-2" style="color:#89ddff"></span>
			</div>
			<span class="code-cursor" style="color:#d6deeb">▍</span>
		</div>
		<div class="editor-footer">
			<span data-build-dot class="build-dot"></span>
			<span data-build-label class="build-label">{pl.buildingLabel}</span>
		</div>
	</div>
</div>

<style>
	.editor-wrap {
		padding: 0 56px 88px;
		max-width: 700px;
		margin: 0 auto;
	}

	.editor-caption {
		font-size: 13px;
		color: var(--muted-light);
		margin-bottom: 14px;
		text-align: center;
	}

	.editor {
		background: #0d1320;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 30px 70px rgba(15, 22, 41, 0.16);
	}

	.editor-titlebar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 13px 16px;
		background: #171f30;
	}

	.tb-dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		display: inline-block;
	}

	.tb-red { background: #ff6058; }
	.tb-yellow { background: #ffbc2e; }
	.tb-green { background: #29c942; }

	.editor-filename {
		margin-left: 10px;
		font-size: 12px;
		color: rgba(214, 222, 235, 0.45);
		font-family: 'DM Sans', sans-serif;
	}

	.editor-body {
		padding: 22px 22px 8px;
		height: 248px;
		overflow: hidden;
	}

	.code-line {
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-size: 13px;
		line-height: 1.65;
		white-space: pre-wrap;
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.editor-footer {
		padding: 12px 22px 16px;
		border-top: 1px solid rgba(214, 222, 235, 0.07);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.build-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ffbc2e;
		display: inline-block;
	}

	.build-label {
		font-size: 12px;
		color: rgba(214, 222, 235, 0.55);
	}
</style>

<script>
	const CODE_LINES = [
		[{ tx: '---', c: '#d6deeb' }],
		[{ tx: '// Strona dla Twojej firmy', c: '#7c8aa6' }],
		[{ tx: 'const ', c: '#c792ea' }, { tx: 'klient', c: '#d6deeb' }, { tx: ' = ', c: '#d6deeb' }, { tx: '"Warsztat Kowalski"', c: '#c3e88d' }, { tx: ';', c: '#d6deeb' }],
		[{ tx: 'const ', c: '#c792ea' }, { tx: 'stack', c: '#d6deeb' }, { tx: ' = [', c: '#d6deeb' }, { tx: '"Astro"', c: '#c3e88d' }, { tx: ', ', c: '#d6deeb' }, { tx: '"TypeScript"', c: '#c3e88d' }, { tx: '];', c: '#d6deeb' }],
		[{ tx: '---', c: '#d6deeb' }],
		[],
		[{ tx: '<', c: '#89ddff' }, { tx: 'Layout', c: '#82aaff' }, { tx: ' client:load', c: '#ffcb6b' }, { tx: '>', c: '#89ddff' }],
		[{ tx: '  <', c: '#89ddff' }, { tx: 'Hero', c: '#82aaff' }, { tx: ' tytul=', c: '#ffcb6b' }, { tx: '{klient}', c: '#d6deeb' }, { tx: ' />', c: '#89ddff' }],
		[{ tx: '  <', c: '#89ddff' }, { tx: 'Uslugi', c: '#82aaff' }, { tx: ' dane=', c: '#ffcb6b' }, { tx: '{stack}', c: '#d6deeb' }, { tx: ' />', c: '#89ddff' }],
		[{ tx: '  <', c: '#89ddff' }, { tx: 'Kontakt', c: '#82aaff' }, { tx: ' />', c: '#89ddff' }],
		[{ tx: '</', c: '#89ddff' }, { tx: 'Layout', c: '#82aaff' }, { tx: '>', c: '#89ddff' }],
	]

	const flat: Array<{ key: string; tx: string }> = []
	CODE_LINES.forEach((line, li) => {
		line.forEach((_tok, ti) => flat.push({ key: `${li}-${ti}`, tx: CODE_LINES[li][ti].tx }))
	})

	const tokenNodes = flat.map(({ key, tx }) => {
		const el = document.querySelector<HTMLElement>(`[data-tok="${key}"]`)
		return el ? { el, full: tx } : null
	}).filter(Boolean) as Array<{ el: HTMLElement; full: string }>

	const buildDot = document.querySelector<HTMLElement>('[data-build-dot]')
	const buildLabel = document.querySelector<HTMLElement>('[data-build-label]')
	const totalChars = flat.reduce((s, t) => s + t.tx.length, 0)

	const getLang = () => (document.documentElement.lang || 'pl') as 'pl' | 'en'
	const getBuildingLabel = () => getLang() === 'en' ? 'Compiling...' : 'Kompilowanie...'
	const getDoneLabel = () => getLang() === 'en' ? 'Deployed' : 'Wdrożono'

	let chars = 0
	let interval: ReturnType<typeof setInterval>
	let restartTimeout: ReturnType<typeof setTimeout>

	function startTyping() {
		clearInterval(interval)
		interval = setInterval(() => {
			chars = Math.min(chars + 2, totalChars)
			let remaining = chars
			for (const t of tokenNodes) {
				const take = Math.max(0, Math.min(remaining, t.full.length))
				t.el.textContent = t.full.slice(0, take)
				remaining -= take
			}
			if (chars >= totalChars) {
				clearInterval(interval)
				if (buildDot) buildDot.style.background = '#29c942'
				if (buildLabel) buildLabel.textContent = getDoneLabel()
				clearTimeout(restartTimeout)
				restartTimeout = setTimeout(() => {
					chars = 0
					tokenNodes.forEach((t) => { t.el.textContent = '' })
					if (buildDot) buildDot.style.background = '#ffbc2e'
					if (buildLabel) buildLabel.textContent = getBuildingLabel()
					startTyping()
				}, 2600)
			}
		}, 32)
	}

	startTyping()
</script>
```

- [ ] **Krok 3: Sprawdź** — sekcja "o mnie" z chipami, edytor kodu poniżej z animacją pisania i migającym kursorem.

- [ ] **Krok 4: Commit**

```bash
git add src/components/About.astro src/components/CodeEditor.astro
git commit -m "feat(about): add about section and code editor typing animation"
```

---

## Task 8: WpVsAstro.astro

**Files:**
- Create: `src/components/WpVsAstro.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section class="cmp">
	<div data-reveal class="cmp-header">
		<div class="eyebrow" data-pl={pl.cmpEy} data-en={en.cmpEy}>{pl.cmpEy}</div>
		<h2 class="cmp-title" data-pl={pl.cmpTitle} data-en={en.cmpTitle}>{pl.cmpTitle}</h2>
	</div>
	<div class="cmp-grid">
		<div data-reveal class="card-wp">
			<div class="tag tag-wp" data-pl={pl.cmpLeftTag} data-en={en.cmpLeftTag}>{pl.cmpLeftTag}</div>
			<div class="card-title" data-pl={pl.cmpLeftTitle} data-en={en.cmpLeftTitle}>{pl.cmpLeftTitle}</div>
			<div class="plugins">
				<span class="plugin" style="transform:rotate(-3deg)">Elementor</span>
				<span class="plugin" style="transform:rotate(2deg);margin-top:6px">WooCommerce</span>
				<span class="plugin" style="transform:rotate(-1deg)">Yoast SEO</span>
				<span class="plugin" style="transform:rotate(3deg);margin-top:8px">WPForms</span>
				<span class="plugin" data-pl={pl.cmpPlugin1} data-en={en.cmpPlugin1} style="transform:rotate(-2deg)">{pl.cmpPlugin1}</span>
				<span class="plugin" data-pl={pl.cmpPlugin2} data-en={en.cmpPlugin2} style="transform:rotate(2deg);margin-top:4px">{pl.cmpPlugin2}</span>
				<span class="plugin" data-pl={pl.cmpPlugin3} data-en={en.cmpPlugin3} style="transform:rotate(-3deg)">{pl.cmpPlugin3}</span>
				<span class="plugin" data-pl={pl.cmpPlugin4} data-en={en.cmpPlugin4} style="transform:rotate(1deg);margin-top:6px">{pl.cmpPlugin4}</span>
			</div>
		</div>
		<div data-reveal data-reveal-d="1" class="vs-badge">VS</div>
		<div data-reveal data-reveal-d="2" class="card-astro">
			<div class="tag tag-astro" data-pl={pl.cmpRightTag} data-en={en.cmpRightTag}>{pl.cmpRightTag}</div>
			<div class="card-title card-title-white" data-pl={pl.cmpRightTitle} data-en={en.cmpRightTitle}>{pl.cmpRightTitle}</div>
			<div class="checklist">
				<div class="check-item"><span class="check-mark">✓</span><span data-pl={pl.cmpR1} data-en={en.cmpR1}>{pl.cmpR1}</span></div>
				<div class="check-item"><span class="check-mark">✓</span><span data-pl={pl.cmpR2} data-en={en.cmpR2}>{pl.cmpR2}</span></div>
				<div class="check-item"><span class="check-mark">✓</span><span data-pl={pl.cmpR3} data-en={en.cmpR3}>{pl.cmpR3}</span></div>
				<div class="check-item"><span class="check-mark">✓</span><span data-pl={pl.cmpR4} data-en={en.cmpR4}>{pl.cmpR4}</span></div>
			</div>
		</div>
	</div>
</section>

<style>
	.cmp {
		padding: 0 56px 88px;
		max-width: 1100px;
		margin: 0 auto;
	}

	.cmp-header {
		text-align: center;
		margin-bottom: 48px;
	}

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
		font-weight: 600;
	}

	.cmp-title {
		font-family: var(--display);
		font-size: 38px;
		font-weight: 600;
		letter-spacing: -0.5px;
		line-height: 1.1;
	}

	.cmp-grid {
		display: grid;
		grid-template-columns: 1fr 56px 1fr;
		align-items: center;
	}

	.card-wp {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 32px;
	}

	.tag {
		display: inline-block;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.5px;
		padding: 4px 12px;
		border-radius: 100px;
		margin-bottom: 18px;
	}

	.tag-wp {
		background: rgba(180, 69, 47, 0.1);
		color: #b4452f;
	}

	.tag-astro {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.card-title {
		font-family: var(--display);
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 20px;
	}

	.card-title-white { color: #fff; }

	.plugins {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
	}

	.plugin {
		background: rgba(180, 69, 47, 0.07);
		color: #b4452f;
		font-size: 13px;
		padding: 7px 14px;
		border-radius: 9px;
		display: inline-block;
	}

	.vs-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--bg);
		border: 1px solid var(--border-med);
		font-size: 11px;
		font-weight: 700;
		color: var(--muted);
		letter-spacing: 0.5px;
	}

	.card-astro {
		background: var(--ink);
		border-radius: 16px;
		padding: 32px;
	}

	.checklist {
		display: flex;
		flex-direction: column;
		gap: 13px;
	}

	.check-item {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.check-mark {
		color: var(--accent);
		font-weight: 700;
		flex-shrink: 0;
	}

	.check-item span:last-child {
		color: rgba(255, 255, 255, 0.75);
		font-size: 14px;
		line-height: 1.5;
	}
</style>
```

- [ ] **Krok 2: Commit**

```bash
git add src/components/WpVsAstro.astro
git commit -m "feat(comparison): add WP vs Astro comparison section"
```

---

## Task 9: Pricing.astro

**Files:**
- Create: `src/components/Pricing.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section id="cennik" class="pricing">
	<div class="pricing-inner">
		<div data-reveal class="pricing-header">
			<div class="eyebrow" data-pl={pl.priceEy} data-en={en.priceEy}>{pl.priceEy}</div>
			<h2 class="section-title" data-pl={pl.priceTitle} data-en={en.priceTitle}>{pl.priceTitle}</h2>
		</div>
		<div class="pricing-grid">
			<div data-reveal class="plan-card">
				<div class="plan-name muted" data-pl={pl.pl1n} data-en={en.pl1n}>{pl.pl1n}</div>
				<div class="plan-price">1 500</div>
				<div class="plan-unit muted" data-pl={pl.net} data-en={en.net}>{pl.net}</div>
				<div class="plan-sep"></div>
				<div class="plan-features">
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl1a} data-en={en.pl1a}>{pl.pl1a}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl1b} data-en={en.pl1b}>{pl.pl1b}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl1c} data-en={en.pl1c}>{pl.pl1c}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl1d} data-en={en.pl1d}>{pl.pl1d}</span></div>
				</div>
			</div>
			<div data-reveal data-reveal-d="1" class="plan-card plan-featured">
				<div class="popular-badge" data-pl={pl.popular} data-en={en.popular}>{pl.popular}</div>
				<div class="plan-name accent" data-pl={pl.pl2n} data-en={en.pl2n}>{pl.pl2n}</div>
				<div class="plan-price">3 000</div>
				<div class="plan-unit muted" data-pl={pl.net} data-en={en.net}>{pl.net}</div>
				<div class="plan-sep"></div>
				<div class="plan-features">
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl2a} data-en={en.pl2a}>{pl.pl2a}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl2b} data-en={en.pl2b}>{pl.pl2b}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl2c} data-en={en.pl2c}>{pl.pl2c}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl2d} data-en={en.pl2d}>{pl.pl2d}</span></div>
				</div>
			</div>
			<div data-reveal data-reveal-d="2" class="plan-card plan-custom">
				<div class="plan-name muted">Custom</div>
				<div class="plan-price" data-pl={pl.quote} data-en={en.quote}>{pl.quote}</div>
				<div class="plan-unit muted" data-pl={pl.indiv} data-en={en.indiv}>{pl.indiv}</div>
				<div class="plan-sep"></div>
				<div class="plan-features">
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl3a} data-en={en.pl3a}>{pl.pl3a}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl3b} data-en={en.pl3b}>{pl.pl3b}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl3c} data-en={en.pl3c}>{pl.pl3c}</span></div>
					<div class="feature"><span class="check">✓</span><span data-pl={pl.pl3d} data-en={en.pl3d}>{pl.pl3d}</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.pricing {
		background: var(--surface);
		padding: 84px 56px;
	}

	.pricing-inner {
		max-width: 1280px;
		margin: 0 auto;
	}

	.pricing-header { margin-bottom: 44px; }

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 10px;
		font-weight: 600;
	}

	.section-title {
		font-family: var(--display);
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.5px;
		line-height: 1.05;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 14px;
	}

	.plan-card {
		border: 1px solid rgba(15, 22, 41, 0.09);
		border-radius: 12px;
		padding: 30px;
		position: relative;
	}

	.plan-featured {
		border: 2px solid var(--accent);
	}

	.plan-custom {
		background: var(--bg);
	}

	.popular-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--accent);
		color: #fff;
		font-size: 10px;
		font-weight: 600;
		padding: 3px 12px;
		border-radius: 100px;
		white-space: nowrap;
	}

	.plan-name {
		font-size: 11px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		margin-bottom: 18px;
	}

	.muted { color: rgba(15, 22, 41, 0.3); }
	.accent { color: var(--accent); }

	.plan-price {
		font-family: var(--display);
		font-size: 36px;
		font-weight: 700;
		line-height: 1;
		margin-bottom: 3px;
	}

	.plan-unit {
		font-size: 12px;
		margin-bottom: 22px;
	}

	.plan-sep {
		height: 1px;
		background: var(--border);
		margin-bottom: 22px;
	}

	.plan-features {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}

	.feature {
		display: flex;
		gap: 9px;
		font-size: 13px;
		color: rgba(15, 22, 41, 0.55);
	}

	.check {
		color: var(--accent);
		font-weight: 600;
		flex-shrink: 0;
	}
</style>
```

- [ ] **Krok 2: Commit**

```bash
git add src/components/Pricing.astro
git commit -m "feat(pricing): add pricing cards with featured middle card"
```

---

## Task 10: Reviews.astro

**Files:**
- Create: `src/components/Reviews.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section class="reviews">
	<div data-reveal class="reviews-header">
		<div class="eyebrow" data-pl={pl.revEy} data-en={en.revEy}>{pl.revEy}</div>
		<h2 class="section-title" data-pl={pl.revTitle} data-en={en.revTitle}>{pl.revTitle}</h2>
	</div>
	<div class="reviews-grid">
		<div data-reveal class="review-card">
			<div class="quote-mark">"</div>
			<p class="quote-text" data-pl={pl.rev1} data-en={en.rev1}>{pl.rev1}</p>
			<div class="reviewer">
				<div class="avatar"></div>
				<div>
					<div class="reviewer-name">Anna Kowalczyk</div>
					<div class="reviewer-role">Kancelaria Lex, Rzeszów</div>
				</div>
			</div>
		</div>
		<div data-reveal data-reveal-d="1" class="review-card">
			<div class="quote-mark">"</div>
			<p class="quote-text" data-pl={pl.rev2} data-en={en.rev2}>{pl.rev2}</p>
			<div class="reviewer">
				<div class="avatar"></div>
				<div>
					<div class="reviewer-name">Piotr Malinowski</div>
					<div class="reviewer-role">Studio Glow, Kraków</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.reviews {
		padding: 84px 56px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.reviews-header { margin-bottom: 44px; }

	.eyebrow {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 10px;
		font-weight: 600;
	}

	.section-title {
		font-family: var(--display);
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.5px;
		line-height: 1.05;
	}

	.reviews-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.review-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 30px;
	}

	.quote-mark {
		font-family: var(--display);
		font-size: 30px;
		color: var(--accent);
		line-height: 1;
		margin-bottom: 14px;
	}

	.quote-text {
		font-size: 15px;
		line-height: 1.7;
		color: var(--muted);
		margin: 0 0 22px;
	}

	.reviewer {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: repeating-linear-gradient(45deg, #e2dfd8, #e2dfd8 3px, #d8d5cd 3px, #d8d5cd 6px);
		flex-shrink: 0;
	}

	.reviewer-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text);
	}

	.reviewer-role {
		font-size: 11px;
		color: rgba(15, 22, 41, 0.35);
		margin-top: 2px;
	}
</style>
```

- [ ] **Krok 2: Commit**

```bash
git add src/components/Reviews.astro
git commit -m "feat(reviews): add sample testimonials section"
```

---

## Task 11: Contact.astro + ContactForm.tsx

**Files:**
- Create: `src/components/Contact.astro`
- Create: `src/components/ContactForm.tsx`

Netlify Forms: `Contact.astro` ma slot na `ContactForm` island; `ContactForm` submituje przez fetch POST. Pola formularza w `ContactForm` NIE mają `name` atrybutu (React controlled) — wartości wysyłane przez body fetch, nie przez native form submit.

- [ ] **Krok 1: Utwórz Contact.astro**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<section id="kontakt" class="contact">
	<div class="contact-inner">
		<div data-reveal class="contact-info">
			<h2 class="contact-title" data-pl={pl.contactTitle} data-en={en.contactTitle}>{pl.contactTitle}</h2>
			<p class="contact-sub" data-pl={pl.contactSub} data-en={en.contactSub}>{pl.contactSub}</p>
			<div class="contact-links">
				<div class="contact-row">
					<span class="contact-label">Email:</span>
					<a href="mailto:miloszbembnowicz@gmail.com" class="contact-link">miloszbembnowicz@gmail.com</a>
				</div>
				<div class="contact-row">
					<span class="contact-label">Telefon:</span>
					<a href="tel:+48733969987" class="contact-link">+48 733 969 987</a>
				</div>
			</div>
			<div class="socials">
				<!-- X / Twitter -->
				<a href="#" class="social-icon" aria-label="X">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
				</a>
				<!-- LinkedIn -->
				<a href="#" class="social-icon" aria-label="LinkedIn">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
				</a>
				<!-- GitHub -->
				<a href="#" class="social-icon" aria-label="GitHub">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
				</a>
				<!-- Mail -->
				<a href="mailto:miloszbembnowicz@gmail.com" class="social-icon" aria-label="Email">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,14 22,4"/></svg>
				</a>
			</div>
		</div>
		<slot name="form" />
	</div>
</section>

<style>
	.contact {
		background: var(--bg);
		padding: 96px 56px;
		border-top: 1px solid var(--border);
	}

	.contact-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 56px;
		align-items: stretch;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
	}

	.contact-title {
		font-family: var(--display);
		font-size: 66px;
		font-weight: 600;
		letter-spacing: -1px;
		color: var(--text);
		margin: 0 0 22px;
		line-height: 0.96;
	}

	.contact-sub {
		color: var(--muted);
		font-size: 16px;
		line-height: 1.65;
		max-width: 360px;
	}

	.contact-links {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 32px;
	}

	.contact-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.contact-label {
		color: var(--muted-light);
		font-size: 14px;
	}

	.contact-link {
		color: var(--text);
		text-decoration: none;
		font-size: 16px;
		font-weight: 500;
	}

	.contact-link:hover {
		color: var(--accent);
	}

	.socials {
		display: flex;
		gap: 16px;
		margin-top: 28px;
	}

	.social-icon {
		color: var(--muted);
		transition: color 0.15s;
	}

	.social-icon:hover {
		color: var(--text);
	}
</style>
```

- [ ] **Krok 2: Utwórz ContactForm.tsx**

Island React z Netlify Forms przez fetch. Listens na `langchange` event do tłumaczenia etykiet.

```tsx
import { useState, useEffect } from 'react'
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}

const encode = (data: Record<string, string>) =>
	Object.keys(data)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&')

export default function ContactForm({ pl, en }: Props) {
	const [lang, setLang] = useState<'pl' | 'en'>('pl')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

	useEffect(() => {
		const handler = (e: Event) => {
			setLang((e as CustomEvent<{ lang: 'pl' | 'en' }>).detail.lang)
		}
		window.addEventListener('langchange', handler)
		return () => window.removeEventListener('langchange', handler)
	}, [])

	const t = lang === 'pl' ? pl : en

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setStatus('sending')
		try {
			await fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: encode({ 'form-name': 'contact', name, email, message }),
			})
			setStatus('done')
		} catch {
			setStatus('done')
		}
	}

	const inputStyle: React.CSSProperties = {
		background: 'rgba(255,255,255,0.05)',
		border: '1px solid rgba(255,255,255,0.12)',
		borderRadius: 11,
		padding: '14px 16px',
		color: '#fff',
		fontSize: 14,
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
				<p style={{ color: '#fff', fontSize: 16, textAlign: 'center', padding: '40px 0' }}>
					{t.successMsg}
				</p>
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
```

- [ ] **Krok 3: Sprawdź** — sekcja kontakt z danymi, ikonami social, formularzem w ciemnej karcie.

- [ ] **Krok 4: Commit**

```bash
git add src/components/Contact.astro src/components/ContactForm.tsx
git commit -m "feat(contact): add contact section and Netlify form island"
```

---

## Task 12: Footer.astro

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Krok 1: Utwórz plik**

```astro
---
import type { LangCopy } from '../i18n/copy'

interface Props {
	pl: LangCopy
	en: LangCopy
}
const { pl, en } = Astro.props
---

<footer>
	<div class="footer-name">Miłosz Bembnowicz</div>
	<div class="footer-copy">© 2026 · Rzeszów · Kraków i okolice</div>
	<div class="footer-lang" data-pl={pl.langLabel} data-en={en.langLabel}>{pl.langLabel}</div>
</footer>

<style>
	footer {
		padding: 22px 56px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg);
		border-top: 1px solid var(--border);
	}

	.footer-name {
		font-family: var(--display);
		font-weight: 600;
		font-size: 15px;
	}

	.footer-copy {
		font-size: 12px;
		color: rgba(15, 22, 41, 0.25);
	}

	.footer-lang {
		font-size: 12px;
		color: rgba(15, 22, 41, 0.35);
	}
</style>
```

- [ ] **Krok 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): add footer with name and copyright"
```

---

## Task 13: index.astro — składanie strony + Netlify form

**Files:**
- Modify: `src/pages/index.astro`

Uwaga: ukryty `<form>` z `data-netlify="true"` musi być w statycznym HTML żeby Netlify go wykrył podczas deploya. React island `ContactForm` submituje do tego samego endpointu przez fetch.

- [ ] **Krok 1: Nadpisz index.astro**

```astro
---
import Layout from '../layouts/Layout.astro'
import Nav from '../components/Nav.astro'
import LangSwitcher from '../components/LangSwitcher'
import Hero from '../components/Hero.astro'
import Stats from '../components/Stats.astro'
import Projects from '../components/Projects.astro'
import Services from '../components/Services.astro'
import About from '../components/About.astro'
import CodeEditor from '../components/CodeEditor.astro'
import WpVsAstro from '../components/WpVsAstro.astro'
import Pricing from '../components/Pricing.astro'
import Reviews from '../components/Reviews.astro'
import Contact from '../components/Contact.astro'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer.astro'
import { COPY } from '../i18n/copy'

const pl = COPY.pl
const en = COPY.en
---

<Layout title="Miłosz Bembnowicz — Strony internetowe dla firm">
	<!-- Ukryty formularz dla Netlify (wykrywany przy buildzie) -->
	<form name="contact" data-netlify="true" hidden>
		<input type="text" name="name" />
		<input type="email" name="email" />
		<textarea name="message"></textarea>
	</form>

	<Nav pl={pl} en={en}>
		<LangSwitcher client:load slot="lang-switcher" />
	</Nav>

	<Hero pl={pl} en={en} />
	<Stats pl={pl} en={en} />
	<Projects pl={pl} en={en} />
	<Services pl={pl} en={en} />
	<About pl={pl} en={en} />
	<CodeEditor pl={pl} en={en} />
	<WpVsAstro pl={pl} en={en} />
	<Pricing pl={pl} en={en} />
	<Reviews pl={pl} en={en} />

	<Contact pl={pl} en={en}>
		<ContactForm client:visible pl={pl} en={en} slot="form" />
	</Contact>

	<Footer pl={pl} en={en} />
</Layout>
```

- [ ] **Krok 2: Uruchom dev server i weryfikuj**

```bash
astro dev --background
```

Sprawdź kolejno:
1. Strona ładuje się bez błędów w konsoli
2. Sticky nav działa, linki kotwic scrollują do sekcji
3. Przycisk `PL / EN` przełącza tekst całej strony (nav, hero, stats, sekcje)
4. Scroll reveal animuje elementy przy scrollowaniu w dół
5. Hover na kartach realizacji unosi je, overlay "Zobacz podgląd" pojawia się
6. Animacja edytora kodu zapełnia się, kursor miga, footer zmienia "Kompilowanie..." → "Wdrożono" → reset
7. Formularz kontaktowy: pola wymagane, przycisk wyślij (lokalnie możesz zobaczyć błąd fetch — to normalne bez Netlify)
8. Logo w karcie przeglądarki (SVG favicon)

- [ ] **Krok 3: Final commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble full portfolio one-pager with all sections"
git push
```

---

## Self-Review

### Spec coverage

| Wymaganie | Task |
|-----------|------|
| Sticky nav + linki kotwic | Task 2 |
| Przełącznik PL/EN (React island) | Task 2 |
| Hero z zieloną kropką, H1, CTA | Task 3 |
| Stats strip 4 statystyki | Task 4 |
| Realizacje grid 2×2 z browser mockup + hover | Task 5 |
| Usługi 4 karty | Task 6 |
| O mnie + chipy technologii | Task 7 |
| Animacja edytora kodu (DOM manipulation, nie React state) | Task 7 |
| WP vs Astro porównanie | Task 8 |
| Cennik 3 karty | Task 9 |
| Opinie (oznaczone jako przykładowe) | Task 10 |
| Kontakt: email, telefon, social icons (placeholder) | Task 11 |
| Formularz Netlify Forms | Task 11 |
| Footer | Task 12 |
| Favicon (logo.svg) | Task 1 (Layout) |
| Scroll reveal przy scrollu | Task 1 (Layout) |
| Dane kontaktowe realne | Contact.astro ✓ |

### Placeholders scan

Brak TBD/TODO. Każda sekcja ma pełny kod.

### Type consistency

- `LangCopy` — definiowany w `copy.ts`, używany identycznie we wszystkich komponentach
- `data-pl` / `data-en` — spójny pattern we wszystkich komponentach
- `data-tok="lineIndex-tokenIndex"` — używane w CodeEditor.astro i skrypcie JS CodeEditor
- `data-build-dot` / `data-build-label` — tylko w CodeEditor.astro
- `langchange` CustomEvent — dispatchowany w LangSwitcher.tsx, nasłuchiwany w ContactForm.tsx
