const elements = document.querySelectorAll("[data-interactions]");

elements.forEach((element) => {
  const value = element.dataset.interactions;

  if (value === "hover") {
    element
      .appendChild(document.createElement("div"))
      .classList.add("hover-indicator");
    element.addEventListener("pointerover", () => {
      element.classList.add("hovered");
    });
    element.addEventListener("pointerout", () => {
      element.classList.remove("hovered");
    });
    element.addEventListener("pointerdown", () => {
      element.classList.add("active");
    });
  }
});

document.addEventListener("pointerup", (e) => {
  elements.forEach((element) => {
    if (
      element.dataset.interactions === "hover" &&
      element.classList.contains("active")
    ) {
      element.classList.remove("active");
    }
  });

  if (
    searchBarContainer.classList.contains("active") &&
    !searchBarContainer.contains(e.target)
  ) {
    searchBarContainer.classList.remove("active");
  }
  if (
    weatherBtn.parentElement.classList.contains("active") &&
    !weatherBtn.parentElement.contains(e.target)
  ) {
    weatherBtn.parentElement.classList.remove("active");
  }
  const settingsWrapper = document.getElementById("settingsBtn").parentElement;
  if (
    settingsWrapper.classList.contains("active") &&
    !settingsWrapper.contains(e.target)
  ) {
    settingsWrapper.classList.remove("active");
  }
});

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchEngineBtn = document.getElementById("searchEngineBtn");
const enginesList = document.getElementById("enginesList");
const activeEngine = document.getElementById("activeEngine");
const searchForm = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");
const searchBarContainer = document.getElementById("searchBarContainer");

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape") {
    searchInput.blur();
  }
});

searchBarContainer.addEventListener("focusin", () => {
  document.body.classList.add("search-bar-focused");
});
searchBarContainer.addEventListener("focusout", () => {
  document.body.classList.remove("search-bar-focused");
});
searchInput.addEventListener("input", () => {
  checkClearButtonVisibility();
});
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  checkClearButtonVisibility();
});

searchEngineBtn.addEventListener("click", () => {
  searchBarContainer.classList.toggle("active");
  loadSearchEngine();
});

searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim() === "") {
    searchInput.focus();
  }
});

enginesList.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    window.localStorage.setItem("searchEngine", button.dataset.engine);
    searchBarContainer.classList.remove("active");
    loadSearchEngine();
  });
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query === "") return;
  const searchEngine = window.localStorage.getItem("searchEngine") || "brave";
  let searchURL = "";
  switch (searchEngine) {
    case "brave":
      searchURL = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
      break;
    case "google":
      searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
    case "bing":
      searchURL = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      break;
    case "duckduckgo":
      searchURL = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      break;
    default:
      searchURL = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
  }
  window.location.href = searchURL;
});

function checkClearButtonVisibility() {
  if (searchInput.value.trim() === "") {
    clearSearchBtn.style.opacity = "0";
  } else {
    clearSearchBtn.style.opacity = "1";
  }
}

function loadSearchEngine() {
  const searchEngine = window.localStorage.getItem("searchEngine") || "brave";
  const targetBtn = document.querySelector(
    `#enginesList button[data-engine="${searchEngine}"]`,
  );
  if (targetBtn) {
    activeEngine.innerHTML = targetBtn.querySelector(".icon").innerHTML;
  }
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const is24HourFormat = () => {
  const format = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).formatToParts(new Date());
  return !format.some((part) => part.type === "dayPeriod");
};

function updateTimeAndDate() {
  const timeElement = document.getElementById("time");
  const dateElement = document.getElementById("date");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const month = months[now.getMonth()];
  timeElement.children[0].textContent = `${is24HourFormat() ? hours : parseInt(hours) % 12 || 12}:${minutes}`;
  dateElement.children[0].textContent = `${day} ${month} `;
}
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);

const weatherIcons = {
  0: "sun",
  1: "cloud-sun",
  2: "clouds",
  3: "clouds",
  45: "fog",
  48: "fog",
  51: "rain",
  53: "rain",
  55: "rain",
  56: "rain",
  57: "rain",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

const weatherBtn = document.getElementById("weatherBtn");
weatherBtn.addEventListener("click", () => {
  weatherBtn.parentElement.classList.toggle("active");
});

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m`;
  try {
    const response = await fetch(url);
    return (await response.json()).current;
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return null;
  }
}

async function getCoordinatesFromCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name,
      };
    }
    return null;
  } catch (e) {
    console.error("Geocoding failed", e);
    return null;
  }
}

function updateWeatherUI(weather, iconSVG) {
  document.querySelector(".weather-icon").innerHTML = iconSVG;
  document.querySelector(".weather-temp").textContent =
    `${Math.round(weather.temperature_2m)}°`;
  document.querySelector(".humidity").textContent =
    `${weather.relative_humidity_2m}%`;
  document.querySelector(".wind").textContent =
    `${Math.round(weather.wind_speed_10m)} km/h`;
  document.querySelector(".feels-like").textContent =
    `${Math.round(weather.apparent_temperature)}°`;
}

async function processWeatherMetrics(lat, lon) {
  const weather = await getWeather(lat, lon);
  if (weather) {
    const temperatureElement = document.getElementById("temperature");
    const weatherIconElement = document.getElementById("weatherIcon");
    const iconKey = weatherIcons[weather.weather_code] || "unknown";
    const iconSVG = `<img src="assets/icons/weather/${iconKey}.svg" alt="Weather Icon">`;
    temperatureElement.textContent = `${Math.round(weather.temperature_2m)}°C`;
    weatherIconElement.innerHTML = iconSVG;
    updateWeatherUI(weather, iconSVG);

    if (localStorage.getItem("setting_toggleWeather") !== "false") {
      weatherBtn.parentElement.style.display = "flex";
    }
  }
}

function initWeatherService() {
  const savedCity = localStorage.getItem("weather_manual_city");
  const statusMsg = document.getElementById("locationStatusMsg");

  if (savedCity) {
    statusMsg.textContent = `Using custom city: ${savedCity}`;
    const savedLat = localStorage.getItem("weather_lat");
    const savedLon = localStorage.getItem("weather_lon");
    if (savedLat && savedLon) {
      processWeatherMetrics(savedLat, savedLon);
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      statusMsg.textContent = "Location access granted via browser.";
      processWeatherMetrics(
        position.coords.latitude,
        position.coords.longitude,
      );
    },
    (error) => {
      statusMsg.textContent =
        "Location access denied. Please insert a custom city below to activate weather alerts.";
      weatherBtn.parentElement.style.display = "none";
    },
  );
}
const defaultShortcuts = [
  {
    title: "YouTube",
    url: "https://youtube.com",
    append: true,
    searchLink: "https://www.youtube.com/results?search_query=",
    searchAppend: true,
  },
  {
    title: "Facebook",
    url: "https://facebook.com",
    append: true,
    searchLink: "https://www.facebook.com/search/top?q=",
    searchAppend: false,
  },
  {
    title: "Instagram",
    url: "https://instagram.com",
    append: true,
    searchLink: "https://www.instagram.com/explore/tags/",
    searchAppend: true,
  },
  {
    title: "Reddit",
    url: "https://reddit.com",
    append: true,
    searchLink: "https://www.reddit.com/search/?q=",
    searchAppend: true,
  },
  {
    title: "Amazon",
    url: "https://amazon.com",
    append: true,
    searchLink: "https://www.amazon.com/s?k=",
    searchAppend: true,
  },
  {
    title: "Netflix",
    url: "https://netflix.com",
    append: true,
    searchLink: "https://www.netflix.com/search?q=",
    searchAppend: true,
  },
  {
    title: "Cineby",
    url: "https://cineby.app",
    append: true,
    searchLink: "https://www.cineby.app/search?q=",
    searchAppend: false,
  },
  {
    title: "GitHub",
    url: "https://github.com",
    append: true,
    searchLink: "https://github.com/search?q=",
    searchAppend: false,
  },
  {
    title: "ChatGPT",
    url: "https://chatgpt.com",
    append: true,
    searchLink: null,
    searchAppend: false,
  },
];

function initShortcutsStore() {
  if (!localStorage.getItem("shortcuts_data")) {
    localStorage.setItem("shortcuts_data", JSON.stringify(defaultShortcuts));
  }
  renderShortcutsAndSearchOptions();
}

function renderShortcutsAndSearchOptions() {
  const shortcuts = JSON.parse(localStorage.getItem("shortcuts_data") || "[]");

  const searchOptionsContainer = document.getElementById("searchOptions");
  const shortcutsContainer = document.querySelector("#shortcutsContainer");

  searchOptionsContainer.innerHTML = "";
  shortcutsContainer.innerHTML = "";

  shortcuts.forEach((shortcut, index) => {
    const domain = new URL(shortcut.url).hostname;
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (shortcut.searchLink && shortcut.searchAppend) {
      const button = document.createElement("button");
      button.classList.add("search-option", "glass-bg");
      button.dataset.interactions = "hover";
      button.innerHTML = `
        <div class="icons-container">
          <div class="icon"><img src="${icon}" alt="${shortcut.title} logo"></div>
          <div class="icon"><img src="./assets/icons/search.svg" alt="search"></div>
        </div>
      `;
      button.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query === "") {
          searchInput.focus();
          return;
        }
        window.open(shortcut.searchLink + encodeURIComponent(query), "_blank");
      });
      searchOptionsContainer.appendChild(button);
    }

    if (shortcut.append) {
      const element = document.createElement("div");
      element.classList.add("shortcut");
      element.setAttribute("draggable", "true");
      element.dataset.index = index;
      const firstLetter = shortcut.title.charAt(0).toUpperCase();
      element.innerHTML = `
        <button type="button" class="delete-shortcut-btn" title="Remove Shortcut">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <a href="${shortcut.url}" class="shortcut-link" style="display: flex; flex-direction: column; align-items: center; color: white;">
          <div class="shortcut-icon">
            <img src="${icon}" alt="${shortcut.title}"/>
            <span>${firstLetter}</span>
          </div>
          <div class="shortcut-title">${shortcut.title}</div>
        </a>
      `;

      element
        .querySelector(".delete-shortcut-btn")
        .addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteShortcutItem(index);
        });
      bindDragAndDropEvents(element);
      const image = element.querySelector("img");
      image.onerror = () => {
        image.style.display = "none";
        element.querySelector(".shortcut-icon span").style.display = "flex";
      };
      shortcutsContainer.appendChild(element);
    }
  });

  applyDynamicHoverInteractions();
}

function deleteShortcutItem(index) {
  let shortcuts = JSON.parse(localStorage.getItem("shortcuts_data") || "[]");
  shortcuts.splice(index, 1);
  localStorage.setItem("shortcuts_data", JSON.stringify(shortcuts));
  renderShortcutsAndSearchOptions();
}

function bindDragAndDropEvents(element) {
  element.addEventListener("dragstart", (e) => {
    element.classList.add("dragging");
    e.dataTransfer.setData("text/plain", element.dataset.index);
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
  });

  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  element.addEventListener("drop", (e) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const targetIndex = parseInt(element.dataset.index, 10);
    if (sourceIndex === targetIndex) return;
    let shortcuts = JSON.parse(localStorage.getItem("shortcuts_data") || "[]");
    const movedItem = shortcuts.splice(sourceIndex, 1)[0];
    shortcuts.splice(targetIndex, 0, movedItem);
    localStorage.setItem("shortcuts_data", JSON.stringify(shortcuts));
    renderShortcutsAndSearchOptions();
  });
}

function applyDynamicHoverInteractions() {
  document
    .querySelectorAll(".search-option[data-interactions='hover']")
    .forEach((element) => {
      if (element.querySelector(".hover-indicator")) return;
      element
        .appendChild(document.createElement("div"))
        .classList.add("hover-indicator");
      element.addEventListener("pointerover", () =>
        element.classList.add("hovered"),
      );
      element.addEventListener("pointerout", () =>
        element.classList.remove("hovered"),
      );
      element.addEventListener("pointerdown", () =>
        element.classList.add("active"),
      );
    });
}

const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", () => {
  settingsBtn.parentElement.classList.toggle("active");
});

function initSettingsPanelControls() {
  const targets = [
    {
      id: "toggleTime",
      storage: "setting_toggleTime",
      element: document.querySelector(".time-date"),
    },
    {
      id: "toggleWeather",
      storage: "setting_toggleWeather",
      element: document.querySelector(".top-bar .right .weather"),
    },
    {
      id: "toggleShortcuts",
      storage: "setting_toggleShortcuts",
      element: document.querySelector("#shortcutsContainer"),
    },
    {
      id: "toggleSearchOptions",
      storage: "setting_toggleSearchOptions",
      element: document.getElementById("searchOptions"),
    },
  ];

  targets.forEach((item) => {
    const checkbox = document.getElementById(item.id);
    const savedVal = localStorage.getItem(item.storage);

    if (savedVal === "false") {
      checkbox.checked = false;
      item.element.classList.add("element-hidden");
    } else {
      checkbox.checked = true;
      if (item.id === "toggleWeather") {
        item.element.style.display = "flex";
      }
    }

    checkbox.addEventListener("change", () => {
      localStorage.setItem(item.storage, checkbox.checked);
      if (checkbox.checked) {
        item.element.classList.remove("element-hidden");
        if (item.id === "toggleWeather") item.element.style.display = "flex";
      } else {
        item.element.classList.add("element-hidden");
      }
    });
  });

  const saveCityBtn = document.getElementById("saveCityBtn");
  const manualCityInput = document.getElementById("manualCityInput");
  const statusMsg = document.getElementById("locationStatusMsg");

  saveCityBtn.addEventListener("click", async () => {
    const city = manualCityInput.value.trim();
    if (!city) return;

    statusMsg.textContent = "Searching coordinates for city...";
    const coords = await getCoordinatesFromCity(city);
    if (coords) {
      localStorage.setItem("weather_manual_city", coords.name);
      localStorage.setItem("weather_lat", coords.lat);
      localStorage.setItem("weather_lon", coords.lon);
      statusMsg.textContent = `Saved! Using custom city: ${coords.name}`;
      manualCityInput.value = "";
      processWeatherMetrics(coords.lat, coords.lon);
    } else {
      statusMsg.textContent =
        "City matching failed. Verify spelling parameters.";
    }
  });

  document.getElementById("addCustomItemBtn").addEventListener("click", () => {
    const titleInput = document.getElementById("customTitle");
    const urlInput = document.getElementById("customUrl");
    const searchUrlInput = document.getElementById("customSearchUrl");
    const appendCheck = document.getElementById("customAppend");
    const searchAppendCheck = document.getElementById("customSearchAppend");

    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    let searchLink = searchUrlInput.value.trim();

    if (!title || !url) {
      alert(
        "Please specify at least a Title and direct target URL asset parameters.",
      );
      return;
    }

    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    if (searchLink && !/^https?:\/\//i.test(searchLink))
      searchLink = "https://" + searchLink;

    const newItem = {
      title: title,
      url: url,
      append: appendCheck.checked,
      searchLink: searchLink || null,
      searchAppend: searchAppendCheck.checked,
    };

    let existingShortcuts = JSON.parse(
      localStorage.getItem("shortcuts_data") || "[]",
    );
    existingShortcuts.push(newItem);
    localStorage.setItem("shortcuts_data", JSON.stringify(existingShortcuts));

    titleInput.value = "";
    urlInput.value = "";
    searchUrlInput.value = "";

    renderShortcutsAndSearchOptions();
  });
}

window.addEventListener("load", () => {
  loadSearchEngine();
  checkClearButtonVisibility();
  initSettingsPanelControls();
  initShortcutsStore();
  initWeatherService();
});
