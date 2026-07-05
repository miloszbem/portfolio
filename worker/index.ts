interface AnalyticsEngineDataset {
	writeDataPoint(data: { blobs?: string[]; doubles?: number[]; indexes?: string[] }): void
}

export interface Env {
	RESEND_API_KEY: string
	CONTACT_TO_EMAIL: string
	ASSETS: { fetch(request: Request): Promise<Response> }
	ANALYTICS: AnalyticsEngineDataset
}

interface ContactPayload {
	name?: string
	email?: string
	phone?: string
	message?: string
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

const OUTBOUND_LINKS: Record<string, string> = {
	kancelaria: 'https://adwokatdamiandzida.pl/',
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		const outboundMatch = url.pathname.match(/^\/out\/([a-z0-9-]+)$/)
		if (outboundMatch) {
			const target = OUTBOUND_LINKS[outboundMatch[1]]
			if (!target) {
				return new Response('Not found', { status: 404 })
			}
			env.ANALYTICS.writeDataPoint({ blobs: ['outbound_click', outboundMatch[1]], indexes: ['outbound_click'] })
			return Response.redirect(target, 302)
		}

		if (url.pathname === '/api/contact' && request.method === 'POST') {
			return handleContact(request, env)
		}

		const lastSegment = url.pathname.split('/').pop() ?? ''
		const isPageRoute = request.method === 'GET' && !url.pathname.startsWith('/api/') && !lastSegment.includes('.')
		if (isPageRoute) {
			env.ANALYTICS.writeDataPoint({ blobs: ['pageview', url.pathname], indexes: ['pageview'] })
		}

		return env.ASSETS.fetch(request)
	},
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	let payload: ContactPayload
	try {
		payload = await request.json()
	} catch {
		return Response.json({ error: 'Invalid JSON' }, { status: 400 })
	}

	const { name, email, phone, message } = payload

	if (!name || !email || !message) {
		return Response.json({ error: 'Missing required fields' }, { status: 400 })
	}

	const safeName = name.replace(/[\r\n]+/g, ' ').trim()

	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: 'Formularz kontaktowy <kontakt@miloszbembnowicz.pl>',
				to: [env.CONTACT_TO_EMAIL],
				reply_to: email,
				subject: `Nowa wiadomość od ${safeName}`,
				text: `Imię: ${name}\nEmail: ${email}\nTelefon: ${phone || '-'}\n\n${message}`,
				html: `<p><strong>Imię:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Telefon:</strong> ${escapeHtml(phone || '-')}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
			}),
		})

		if (!res.ok) {
			return Response.json({ error: 'Send failed' }, { status: 502 })
		}
	} catch {
		return Response.json({ error: 'Send failed' }, { status: 502 })
	}

	return Response.json({ ok: true })
}
