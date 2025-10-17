function handlePanelToggle(radioPanelStatus) {
	const radioPanel = document.querySelector('#area_player')
	const value = radioPanelStatus ? 'hidden' : ''
	radioPanel.setAttribute('style', `content-visibility: ${value};`)
}

function handlePlayerToggle(radioPlayerStatus) {
	const radioPlayer = document.querySelector('#player2')
	if (radioPlayerStatus) {
		radioPlayer.removeAttribute('autoplay')
		radioPlayer.pause()
	} else {
		radioPlayer.play()
	}
}

async function handleInitialValues() {
	const result = await chrome.storage.sync.get([
		'radioPanelStatus',
		'radioPlayerStatus',
	])
	const parsedStatus = JSON.parse(
		`{"radioPanelStatus": ${result.radioPanelStatus}, "radioPlayerStatus": ${result.radioPlayerStatus}}`
	)

	const { radioPanelStatus, radioPlayerStatus } = parsedStatus
	handlePanelToggle(radioPanelStatus)
	handlePlayerToggle(radioPlayerStatus)
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.action === 'first-load-or-refresh') {
		const xpath = "/html/body/div[1]"
		const evaluator = new XPathEvaluator()
		const expression = evaluator.createExpression(xpath)
		const result = expression.evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)

		const adPanels = document.querySelectorAll('[id="675hfgh3453"], [id="6fs7567545g"]')
		const googlePanels = document.querySelectorAll(
			'.adsbygoogle, .google_ad, [id^="google_ads"], [class*="adsbygoogle"]'
		)
		const iframes = document.querySelectorAll('iframe')

		removeDomElements([iframes, adPanels, googlePanels])

		const adPanelAncestor = result.singleNodeValue
		if (adPanelAncestor) {
			adPanelAncestor.remove()
		}
		handleInitialValues()

		sendResponse({ status: 'Executado' })
	} else if (request.action === 'hide-radio-panel') {
		const { radioPanelStatus } = request
		handlePanelToggle(radioPanelStatus)
	} else if (request.action === 'radio-player-click') {
		const { radioPlayerStatus } = request
		handlePlayerToggle(radioPlayerStatus)
	}
})
