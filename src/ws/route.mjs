import pathToRegexp from 'path-to-regexp'

export default class {
	constructor (wss) {
		this.wss = wss
		// 購読済みイベント
		this.events = []
		this.eventHandlers = {}
	}

	eventRegister (ev, f) {
		if (!this.events.includes(ev)) {
			this.wss.on(ev, async (...rest) => {
				if (!(ev in this.eventHandlers)) return
				const handlers = this.eventHandlers[ev]
				const nexter = async () => {
			  		const next = handlers.shift()
			  		if (!next) return
			  		return await next(...rest, nexter)
				}
				const handler = handlers.shift()
				if (!handler) return
				return await handler(...rest, nexter)
			})
			this.eventHandlers[ev] = []
			this.events.push(ev)
		}
		this.eventHandlers[ev].push(f)
	}

	use (ev, ...rest) {
		const [one, two = null] = rest
		let handler, pm
		if (two && typeof two === 'function') handler = two
		if (typeof one === 'function') handler = one
		if (['connection'].includes(ev) && typeof one === 'string') {
		  pm = pathToRegexp(one)
		  const orig = handler
		  handler = async function (...rest) {
			const next = rest.pop()
			const match = this.pm.exec(rest[1].url)
			if (match) return await this.handler(...rest, ...match.slice(1), next)
			return await next()
		  }.bind({
			handler: orig,
			pm
		  })
		}

		this.eventRegister(ev, handler)
	}
}