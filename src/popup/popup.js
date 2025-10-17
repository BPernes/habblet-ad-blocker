import { retrieveSyncStorageValue } from '../utils/storage.js'

const radioPanelCheckbox = document.querySelector("input[name='hide-player']")
const stopRadioElement = document.querySelector("input[name='stop-radio']")

radioPanelCheckbox.addEventListener('click', async () => {
	const radioState = radioPanelCheckbox.checked
	const value = radioState.toString()
	await chrome.storage.sync.set({ radioPanelState: value })

	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		})
		await chrome.tabs.sendMessage(tab.id, {
			action: 'hide-radio-panel',
			radioPanelStatus: radioState,
		})
	} catch (e) {
		console.error(e)
	}
})

stopRadioElement.addEventListener('click', async () => {
	const radioPlayerStatus = stopRadioElement.checked
	const value = radioPlayerStatus.toString()
	await chrome.storage.sync.set({ radioPlayerStatus: value })

	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		})
		await chrome.tabs.sendMessage(tab.id, {
			action: 'radio-player-click',
			radioPlayerStatus: radioPlayerStatus,
		})
	} catch (e) {
		console.error(e)
	}
})

document.addEventListener('DOMContentLoaded', async () => {
	const newPanelState = await retrieveSyncStorageValue('radioPanelStatus')
	const newPlayerState = await retrieveSyncStorageValue('radioPlayerStatus')

	radioPanelCheckbox.checked = newPanelState
	stopRadioElement.checked = newPlayerState
})
