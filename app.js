const STORAGE_PREFIX = "viewport-preview-"
const STORAGE_KEY = STORAGE_PREFIX + "urls"
const COLOR_MODE_KEY = STORAGE_PREFIX + "color-mode"
const MAX_HISTORY = 10
const MIN_SIZE = 200
const SELECTED_BORDER = ["border-green-400", "dark:border-green-600"]
const DEFAULT_BORDER = ["border-gray-300", "dark:border-gray-600"]
const HOVER_CLASSES = ["hover:bg-gray-50", "dark:hover:bg-gray-700"]

const $ = (id) => document.getElementById(id)
const urlInput = $("url")
const urlHistory = $("url-history")
const urlHistoryEmpty = urlHistory.innerHTML
const clearHistoryBtn = $("clear-history")
const customWidth = $("customWidth")
const customHeight = $("customHeight")
const submitBtn = $("popupButton")
const phoneContainer = $("phone-presets")
const tabletContainer = $("tablet-presets")

let selectedWidth, selectedHeight

function getRecentUrls() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveUrl(url) {
  const urls = getRecentUrls().filter((u) => u !== url)
  urls.unshift(url)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls.slice(0, MAX_HISTORY)))
  renderUrlHistory()
}

function renderUrlHistory() {
  const urls = getRecentUrls()
  urlHistory.innerHTML = ""

  if (urls.length === 0) {
    urlHistory.innerHTML = urlHistoryEmpty
    clearHistoryBtn.classList.add("hidden")
    return
  }

  clearHistoryBtn.classList.remove("hidden")

  urls.forEach((url) => {
    const li = document.createElement("li")
    const link = document.createElement("a")
    link.href = "#"
    link.textContent = url
    link.className =
      "text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
    link.addEventListener("click", (e) => {
      e.preventDefault()
      urlInput.value = url
      validateForm()
      $("menu-dropdown").hidePopover()
    })
    li.appendChild(link)
    urlHistory.appendChild(li)
  })
}

function clearHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  renderUrlHistory()
}

function getColorMode() {
  return localStorage.getItem(COLOR_MODE_KEY) || "system"
}

function setColorMode(mode) {
  localStorage.setItem(COLOR_MODE_KEY, mode)
  applyColorMode(mode)
}

function applyColorMode(mode) {
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", isDark)
  $("theme-switcher").dataset.active = mode
}

function hasValidUrl() {
  const url = urlInput.value.trim()
  return /^(https?:\/\/)?[\w-]+\.[\w.-]*[\w]{2,}(\/\S*)?$/.test(url)
}

function hasValidSize() {
  return selectedWidth >= MIN_SIZE && selectedHeight >= MIN_SIZE
}

function validateForm() {
  submitBtn.disabled = !(hasValidUrl() && hasValidSize())
}

function clearSelection() {
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.querySelector(".selected-indicator")?.classList.remove("visible")
    btn.classList.remove(...SELECTED_BORDER)
    btn.classList.add(...DEFAULT_BORDER, ...HOVER_CLASSES)
  })
}

function selectDevice(btn) {
  clearSelection()
  customWidth.value = ""
  customHeight.value = ""
  btn.querySelector(".selected-indicator")?.classList.add("visible")
  btn.classList.remove(...DEFAULT_BORDER, ...HOVER_CLASSES)
  btn.classList.add(...SELECTED_BORDER)
  selectedWidth = parseInt(btn.dataset.width)
  selectedHeight = parseInt(btn.dataset.height)
  validateForm()
}

function createDeviceButton(device) {
  const btn = document.createElement("button")
  btn.dataset.width = device.width
  btn.dataset.height = device.height
  btn.className =
    "preset-btn relative px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
  btn.innerHTML = `
    <span class="selected-indicator absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
      </svg>
    </span>
    ${device.name}<br/><span class="text-gray-500 dark:text-gray-400 text-xs">${device.width} × ${device.height}</span>`
  btn.addEventListener("click", () => selectDevice(btn))
  return btn
}

function handleCustomSize() {
  const w = customWidth.value.trim()
  const h = customHeight.value.trim()

  if (w || h) clearSelection()

  const width = parseInt(w)
  const height = parseInt(h)

  if (width >= MIN_SIZE && height >= MIN_SIZE) {
    selectedWidth = width
    selectedHeight = height
  } else {
    selectedWidth = selectedHeight = undefined
  }
  validateForm()
}

function filterNumeric(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "")
  handleCustomSize()
}

function openPopup() {
  let url = urlInput.value.trim()
  if (!/^https?:\/\//.test(url)) url = "https://" + url

  saveUrl(url)

  window.open(
    url,
    "_blank",
    [
      `width=${selectedWidth}`,
      `height=${selectedHeight}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=yes",
    ].join(","),
  )
}

customWidth.addEventListener("input", filterNumeric)
customHeight.addEventListener("input", filterNumeric)
urlInput.addEventListener("input", validateForm)
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !submitBtn.disabled) {
    openPopup()
  }
})
clearHistoryBtn.addEventListener("click", clearHistory)
submitBtn.addEventListener("click", openPopup)
document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => setColorMode(btn.dataset.theme))
})
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (getColorMode() === "system") applyColorMode("system")
})

devices.phones.forEach((phone) =>
  phoneContainer.appendChild(createDeviceButton(phone)),
)
devices.tablets.forEach((tablet) =>
  tabletContainer.appendChild(createDeviceButton(tablet)),
)

selectDevice(document.querySelector(".preset-btn"))
renderUrlHistory()
applyColorMode(getColorMode())
lucide.createIcons()
