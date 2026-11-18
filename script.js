
const buyerList = document.getElementById("buyerList");
const priceRows = document.getElementById("priceRows");
const cropList = document.getElementById("cropList");
const buyerSearch = document.getElementById("buyerSearch");
const statusFilter = document.getElementById("statusFilter");
const mapStatus = document.getElementById("mapLoadStatus");

let buyerMap = null;
let buyerMarkers = [];
let mapIsLoading = false;

function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function safeUrl(value) {
    try {
        const url = new URL(String(value ?? ""));

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {
        return "#";
    }

    return "#";
}

function getBuyers() {
    return typeof buyerData !== "undefined" && Array.isArray(buyerData)
        ? buyerData
        : [];
}

function getPrices() {
    return typeof priceData !== "undefined" && Array.isArray(priceData)
        ? priceData
        : [];
}

function getCrops() {
    return typeof cropData !== "undefined" && Array.isArray(cropData)
        ? cropData
        : [];
}

function renderBuyers() {
    if (!buyerList) return;

    const buyers = getBuyers();

    const searchValue = String(buyerSearch?.value ?? "").toLowerCase().trim();
    const selectedStatus = String(statusFilter?.value ?? "all");

    const filteredBuyers = buyers.filter(buyer => {
        if (!buyer || typeof buyer !== "object") return false;

        const products = Array.isArray(buyer.products)
            ? buyer.products
            : [];

        const searchableText = [
            buyer.name,
            buyer.address,
            products.join(" "),
            buyer.status
        ].map(value => String(value ?? "")).join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            String(buyer.status ?? "") === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredBuyers.length === 0) {
        buyerList.innerHTML = `
            <div class="empty-state">
                <h3>No buyer found</h3>
                <p>Try another search term or select a different filter.</p>
            </div>
        `;
        return;
    }

    buyerList.innerHTML = filteredBuyers.map(buyer => {
        const products = Array.isArray(buyer.products)
            ? buyer.products
            : [];

        const statusClass =
            String(buyer.status ?? "").toLowerCase() === "potential"
                ? "potential"
                : "regional";

        return `
            <article class="buyer-card">
                <div class="buyer-card-top">
                    <span class="buyer-icon">🏢</span>

                    <span class="status-badge ${statusClass}">
                        ${safe(buyer.status || "Potential")}
                    </span>
                </div>

                <h3>${safe(buyer.name || "Unnamed buyer")}</h3>

                <p class="buyer-location">
                    📍 ${safe(buyer.address || "Location unavailable")}
                </p>

                <div class="buyer-products">
                    ${products.map(product =>
                        `<span>${safe(product)}</span>`
                    ).join("")}
                </div>

                ${buyer.phone ? `
                    <p class="buyer-location">
                        ☎ ${safe(buyer.phone)}
                    </p>
                ` : ""}

                <p class="buyer-notes">
                    ${safe(buyer.notes || "No additional information available.")}
                </p>

                <p class="location-accuracy">
                    <strong>Location:</strong>
                    ${safe(buyer.locationAccuracy || "Not verified")}
                </p>

                <a href="${safeUrl(buyer.sourceUrl)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="text-link">
                    View reference ↗
                </a>
            </article>
        `;
    }).join("");
}

function renderPrices() {
    if (!priceRows) {
        console.error("Price table element #priceRows was not found.");
        return;
    }

    const prices = getPrices();

    if (prices.length === 0) {
        priceRows.innerHTML = `
            <tr>
                <td colspan="7">Market price information is currently unavailable.</td>
            </tr>
        `;
        return;
    }

    priceRows.innerHTML = prices.map(item => {
        if (!item || typeof item !== "object") return "";

        const commodity = item.commodity || "Unknown commodity";
        const price = item.price ?? "N/A";
        const unit = item.unit || "kg";

        const category = String(
            item.category ?? item.priceType ?? "Not specified"
        );

        const categoryClass = category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const coverage = item.coverage ?? item.location ?? "Not specified";
        const date = item.date || "Not specified";
        const source = item.source || "Source unavailable";
        const sourceUrl = safeUrl(item.sourceUrl);

        return `
            <tr>
                <td><strong>${safe(commodity)}</strong></td>
                <td class="price-value">${safe(price)}</td>
                <td>${safe(unit)}</td>

                <td>
                    <span class="price-category ${safe(categoryClass)}">
                        ${safe(category)}
                    </span>
                </td>

                <td>${safe(coverage)}</td>
                <td>${safe(date)}</td>

                <td>
                    ${sourceUrl !== "#" ? `
                        <a href="${sourceUrl}"
                           target="_blank"
                           rel="noopener noreferrer">
                            ${safe(source)} ↗
                        </a>
                    ` : safe(source)}

                    <p class="price-notes">
                        ${safe(item.notes || "")}
                    </p>
                </td>
            </tr>
        `;
    }).join("");
}

function renderCrops() {
    if (!cropList) {
        console.error("Crop guide element #cropList was not found.");
        return;
    }

    const crops = getCrops();

    if (crops.length === 0) {
        cropList.innerHTML = `
            <div class="empty-state">
                <h3>No crop information available</h3>
                <p>Please check the crop data.</p>
            </div>
        `;
        return;
    }

    cropList.innerHTML = crops.map(crop => {
        if (!crop || typeof crop !== "object") return "";

        const reminders = [
            crop.reminders,
            crop.plantingReminder,
            crop.harvestReminder,
            crop.marketReminder
        ].filter(value => value && String(value).trim());

        return `
            <article class="crop-card">
                <div class="crop-icon">
                    ${safe(crop.icon || "🌱")}
                </div>

                <h3>${safe(crop.name || "Unnamed crop")}</h3>

                <p>
                    ${safe(crop.description || "No description available.")}
                </p>

                <div class="crop-reminder">
                    <strong>Farmer reminders</strong>

                    ${reminders.length > 0
                        ? reminders.map(reminder => `
                            <p>${safe(reminder)}</p>
                        `).join("")
                        : "<p>No reminders available.</p>"
                    }
                </div>
            </article>
        `;
    }).join("");
}

function updateMapPanel(buyer) {
    const panel = document.getElementById("buyerMapPanel");

    if (!panel || !buyer) return;

    const products = Array.isArray(buyer.products)
        ? buyer.products
        : [];

    const statusClass =
        String(buyer.status ?? "").toLowerCase() === "potential"
            ? "potential"
            : "regional";

    panel.innerHTML = `
        <div class="panel-details">
            <button class="back-button" id="backToOverview">
                ← Back to overview
            </button>

            <span class="eyebrow">BUYER INFORMATION</span>

            <span class="status-badge ${statusClass}">
                ${safe(buyer.status || "Potential")}
            </span>

            <h3>${safe(buyer.name || "Unnamed buyer")}</h3>

            <div class="detail-item">
                <strong>Location</strong>
                <p>${safe(buyer.address || "Not specified")}</p>
            </div>

            ${buyer.phone ? `
                <div class="detail-item">
                    <strong>Contact number</strong>
                    <p>${safe(buyer.phone)}</p>
                </div>
            ` : ""}

            <div class="detail-item">
                <strong>Products</strong>
                <p>${products.map(safe).join(", ") || "Not specified"}</p>
            </div>

            <div class="detail-item">
                <strong>Location accuracy</strong>
                <p>${safe(buyer.locationAccuracy || "Not verified")}</p>
            </div>

            <div class="detail-item">
                <strong>Important information</strong>
                <p>${safe(buyer.notes || "No additional information.")}</p>
            </div>

            <a href="${safeUrl(buyer.sourceUrl)}"
               target="_blank"
               rel="noopener noreferrer"
               class="btn btn-primary full-width">
                View Source
            </a>
        </div>
    `;

    const backButton = document.getElementById("backToOverview");

    if (backButton) {
        backButton.addEventListener("click", showMapOverview);
    }
}

function showMapOverview() {
    const panel = document.getElementById("buyerMapPanel");

    if (!panel) return;

    const buyers = getBuyers();

    const mappedCount = buyerMarkers.length;

    const unmappedCount = buyers.filter(buyer =>
        buyer &&
        String(buyer.status ?? "").toLowerCase() === "potential" &&
        !buyer.geocodeQuery
    ).length;

    panel.innerHTML = `
        <div class="panel-overview">
            <span class="eyebrow">MAP OVERVIEW</span>

            <h3>Potential Buyer Locations</h3>

            <p>
                Select a green marker on the map to view buyer
                information and contact details.
            </p>

            <div class="map-stat">
                <strong id="mappedCount">${mappedCount}</strong>
                <span>Potential buyer locations mapped</span>
            </div>

            <div class="map-stat">
                <strong id="regionalCount">${unmappedCount}</strong>
                <span>Potential leads without a mappable address</span>
            </div>

            <p class="small-note">
                Some markers represent approximate areas. Confirm
                the exact business location by phone before traveling.
            </p>
        </div>
    `;
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function isLocalBukidnonResult(properties) {
    const country = String(properties.country || "").toLowerCase();

    const locationParts = [
        properties.state,
        properties.county,
        properties.city,
        properties.district,
        properties.locality,
        properties.name,
        properties.street
    ];

    const locationText = locationParts
        .map(value => String(value || "").toLowerCase())
        .join(" ");

    const localTerms = [
        "bukidnon",
        "manolo fortich",
        "damilag",
        "alae",
        "tankulan",
        "san miguel",
        "puerto",
        "menzi"
    ];

    return country.includes("philippines") &&
        localTerms.some(term => locationText.includes(term));
}

async function geocodeWithPhoton(query) {
    const endpoint =
        "https://photon.komoot.io/api/?limit=5&q=" +
        encodeURIComponent(query);

    try {
        const response = await fetch(endpoint);

        if (!response.ok) return null;

        const data = await response.json();

        if (!Array.isArray(data.features)) return null;

        const feature = data.features.find(item => {
            const properties = item?.properties || {};
            return isLocalBukidnonResult(properties);
        });

        if (!feature?.geometry?.coordinates) return null;

        const coordinates = feature.geometry.coordinates;

        if (
            coordinates.length < 2 ||
            !Number.isFinite(coordinates[0]) ||
            !Number.isFinite(coordinates[1])
        ) {
            return null;
        }

        return coordinates;

    } catch (error) {
        console.warn("Photon geocoding failed:", error);
        return null;
    }
}

async function geocodeBuyer(buyer) {
    if (!buyer) return null;

    const query = String(
        buyer.geocodeQuery || buyer.address || ""
    ).trim();

    if (!query) return null;

    return await geocodeWithPhoton(query);
}

function createPotentialMarker(buyer, coordinates) {
    if (!buyerMap || !coordinates) return;

    const marker = L.circleMarker(
        [coordinates[1], coordinates[0]],
        {
            radius: 9,
            color: "#003013",
            weight: 2,
            opacity: 1,
            fillColor: "#4CAF50",
            fillOpacity: 0.95
        }
    ).addTo(buyerMap);

    marker.bindTooltip(
        `<strong>${safe(buyer.name || "Potential buyer")}</strong><br>Potential buyer`,
        {
            direction: "top",
            offset: [0, -8]
        }
    );

    marker.bindPopup(`
        <div class="map-popup">
            <strong>${safe(buyer.name || "Potential buyer")}</strong>
            <p>${safe(buyer.address || "Location not specified")}</p>
            <span>Potential buyer</span>
        </div>
    `);

    marker.on("click", () => {
        updateMapPanel(buyer);
    });

    buyerMarkers.push(marker);
}

function initializeMap() {
    const mapElement = document.getElementById("buyerMap");

    if (!mapElement) {
        console.error("Map element #buyerMap was not found.");
        return;
    }

    if (typeof L === "undefined") {
        if (mapStatus) {
            mapStatus.textContent =
                "Map library unavailable. Check your internet connection.";
        }
        return;
    }

    if (buyerMap || mapIsLoading) return;

    mapIsLoading = true;

    try {
        buyerMap = L.map(mapElement).setView([8.369, 124.865], 10);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }
        ).addTo(buyerMap);

        showMapOverview();

        loadPotentialBuyerMarkers();

        setTimeout(() => {
            if (buyerMap) {
                buyerMap.invalidateSize();
            }
        }, 400);

    } catch (error) {
        console.error("Map initialization failed:", error);

        if (mapStatus) {
            mapStatus.textContent =
                "Unable to initialize the map. Check the map configuration.";
        }
    } finally {
        mapIsLoading = false;
    }
}

async function loadPotentialBuyerMarkers() {
    const potentialBuyers = getBuyers().filter(buyer =>
        buyer &&
        String(buyer.status ?? "").toLowerCase() === "potential" &&
        (buyer.geocodeQuery || buyer.address)
    );

    let mapped = 0;
    let failed = 0;

    for (let index = 0; index < potentialBuyers.length; index++) {
        const buyer = potentialBuyers[index];

        if (mapStatus) {
            mapStatus.textContent =
                `Locating potential buyers... ${index + 1} of ${potentialBuyers.length}`;
        }

        const coordinates = await geocodeBuyer(buyer);

        if (coordinates) {
            createPotentialMarker(buyer, coordinates);
            mapped++;
        } else {
            failed++;
        }

        if (index < potentialBuyers.length - 1) {
            await delay(1100);
        }
    }

    if (buyerMarkers.length > 0 && buyerMap) {
        const group = L.featureGroup(buyerMarkers);
        buyerMap.fitBounds(group.getBounds().pad(0.2));
    }

    showMapOverview();

    if (mapStatus) {
        mapStatus.textContent =
            `${mapped} potential buyer locations mapped. ${failed} locations could not be verified by the map service.`;
    }
}

if (buyerSearch) {
    buyerSearch.addEventListener("input", renderBuyers);
}

if (statusFilter) {
    statusFilter.addEventListener("change", renderBuyers);
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("active");
    });
}

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav?.classList.remove("active");
    });
});

renderBuyers();
renderPrices();
renderCrops();
initializeMap();
