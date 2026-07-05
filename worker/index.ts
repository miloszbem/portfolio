export interface Env {
	RESEND_API_KEY: string
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

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (url.pathname !== '/api/contact' || request.method !== 'POST') {
			return new Response('Not found', { status: 404 })
		}

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
					to: ['miloszbembnowicz@gmail.com'],
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
	},
}
