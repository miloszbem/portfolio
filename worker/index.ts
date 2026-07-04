export interface Env {
	EMAIL: { send(message: EmailMessage): Promise<void> }
}

interface EmailMessage {
	to: string
	from: { email: string; name?: string }
	replyTo?: string
	subject: string
	text: string
	html: string
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
			await env.EMAIL.send({
				to: 'miloszbembnowicz@gmail.com',
				from: { email: 'kontakt@miloszbembnowicz.pl', name: 'Formularz kontaktowy' },
				replyTo: email,
				subject: `Nowa wiadomość od ${safeName}`,
				text: `Imię: ${name}\nEmail: ${email}\nTelefon: ${phone || '-'}\n\n${message}`,
				html: `<p><strong>Imię:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Telefon:</strong> ${escapeHtml(phone || '-')}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
			})
		} catch {
			return Response.json({ error: 'Send failed' }, { status: 502 })
		}

		return Response.json({ ok: true })
	},
}
