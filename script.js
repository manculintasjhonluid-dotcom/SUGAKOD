
document.addEventListener("DOMContentLoaded", () => {
    const buyerList = document.getElementById("buyerList");
    const priceRows = document.getElementById("priceRows");
    const cropList = document.getElementById("cropList");
    const buyerSearch = document.getElementById("buyerSearch");
    const statusFilter = document.getElementById("statusFilter");
    const mapLoadStatus = document.getElementById("mapLoadStatus");
    const buyerMapPanel = document.getElementById("buyerMapPanel");

    let buyerMap = null;
    let buyerMarkers = [];
    let geocodedBuyers = [];
    let selectedBuyer = null;

    const getBuyers = () =>
        Array.isArray(window.buyerData) ? window.buyerData : [];

    const getPrices = () =>
        Array.isArray(window.priceData) ? window.priceData : [];

    const getCrops = () =>
        Array.isArray(window.cropData) ? window.cropData : [];

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
        if (!value) return "";

        try {
            const url = new URL(value);

            if (url.protocol === "http:" || url.protocol === "https:") {
                return url.href;
            }
        } catch (error) {
            return "";
        }

        return "";
    }

    function getProducts(buyer) {
        const products = buyer.products || buyer.crops || buyer.commodities;

        if (Array.isArray(products)) {
            return products.join(", ");
        }

        return products || buyer.product || buyer.notes || "Not specified";
    }

    function getPhone(buyer) {
        return buyer.phone || buyer.contact || "Not available";
    }

    function getBuyerAddress(buyer) {
        return buyer.address || buyer.location || "Location not specified";
    }

    function getStatus(buyer) {
        return buyer.status || "Potential";
    }

    function getBuyerAccuracy(buyer) {
        return buyer.locationAccuracy ||
            "Location is approximate. Contact the buyer to confirm the exact business address.";
    }

    function renderBuyers() {
        if (!buyerList) return;

        const searchValue = buyerSearch
            ? buyerSearch.value.toLowerCase().trim()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value.toLowerCase()
            : "all";

        const filteredBuyers = getBuyers().filter(buyer => {
            const searchableText = [
                buyer.name,
                getBuyerAddress(buyer),
                getProducts(buyer),
                buyer.notes,
                buyer.status
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchValue);

            const matchesStatus =
                selectedStatus === "all" ||
                getStatus(buyer).toLowerCase() === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        if (filteredBuyers.length === 0) {
            buyerList.innerHTML = `
                <p class="empty-message">No buyers found.</p>
            `;
            return;
        }

        buyerList.innerHTML = filteredBuyers.map(buyer => {
            const phone = getPhone(buyer);
            const source = safeUrl(buyer.sourceUrl);

            return `
                <div class="buyer-card">
                    <div class="buyer-card-header">
                        <h3>${safe(buyer.name)}</h3>
                        <span class="buyer-status">
                            ${safe(getStatus(buyer))}
                        </span>
                    </div>

                    <p>
                        <strong>Location:</strong>
                        ${safe(getBuyerAddress(buyer))}
                    </p>

                    <p>
                        <strong>Products:</strong>
                        ${safe(getProducts(buyer))}
                    </p>

                    <p>
                        <strong>Contact:</strong>
                        ${safe(phone)}
                    </p>

                    <p>
                        <strong>Information:</strong>
                        ${safe(buyer.notes || "No additional information available.")}
                    </p>

                    ${source ? `
                        <a href="${source}" target="_blank" rel="noopener noreferrer">
                            View Source
                        </a>
                    ` : ""}
                </div>
            `;
        }).join("");
    }

    function renderPrices() {
        if (!priceRows) return;

        const prices = getPrices();

        if (prices.length === 0) {
            priceRows.innerHTML = `
                <tr>
                    <td colspan="6">No price information available.</td>
                </tr>
            `;
            return;
        }

        priceRows.innerHTML = prices.map(item => {
            const commodity = item.commodity || item.category || "Not specified";
            const priceType = item.priceType || item.category || "Not specified";
            const location = item.location || item.coverage || "Not specified";
            const source = safeUrl(item.sourceUrl);

            return `
                <tr>
                    <td>${safe(commodity)}</td>
                    <td>${safe(item.price)}</td>
                    <td>${safe(item.unit)}</td>
                    <td>${safe(priceType)}</td>
                    <td>${safe(location)}</td>
                    <td>
                        ${safe(item.date)}
                        ${source ? `
                            <br>
                            <a href="${source}" target="_blank" rel="noopener noreferrer">
                                Source
                            </a>
                        ` : ""}
                    </td>
                </tr>
            `;
        }).join("");
    }

    function renderCrops() {
        if (!cropList) return;

        const crops = getCrops();

        if (crops.length === 0) {
            cropList.innerHTML = `
                <p>No crop information available.</p>
            `;
            return;
        }

        cropList.innerHTML = crops.map(crop => {
            const reminders = Array.isArray(crop.reminders)
                ? crop.reminders
                : [
                    crop.plantingReminder,
                    crop.harvestReminder,
                    crop.marketReminder
                ].filter(Boolean);

            return `
                <div class="crop-card">
                    <h3>${safe(crop.icon || "🌱")} ${safe(crop.name)}</h3>

                    <p>${safe(crop.description || "No description available.")}</p>

                    <ul>
                        ${reminders.map(reminder => `
                            <li>${safe(reminder)}</li>
                        `).join("")}
                    </ul>
                </div>
            `;
        }).join("");
    }

    function showMapOverview() {
        if (!buyerMapPanel) return;

        const potentialBuyers = getBuyers().filter(buyer =>
            getStatus(buyer).toLowerCase() === "potential"
        );

        buyerMapPanel.innerHTML = `
            <div class="map-overview">
                <h3>Potential Buyer Locator</h3>

                <p>
                    Select a map marker to view the buyer's available
                    information and contact details.
                </p>

                <div class="map-overview-stat">
                    <strong>${potentialBuyers.length}</strong>
                    <span>Potential buyers in the directory</span>
                </div>

                <div class="map-overview-stat">
                    <strong>${geocodedBuyers.length}</strong>
                    <span>Buyers represented by map markers</span>
                </div>

                <p class="map-note">
                    Some markers represent approximate municipality
                    or province locations. Confirm the exact business
                    address before travelling.
                </p>
            </div>
        `;
    }

    function showBuyerInformation(buyer, approximate) {
        if (!buyerMapPanel) return;

        selectedBuyer = buyer;

        const source = safeUrl(buyer.sourceUrl);
        const phone = getPhone(buyer);
        const address = getBuyerAddress(buyer);

        buyerMapPanel.innerHTML = `
            <div class="map-buyer-information">
                <h3>${safe(buyer.name)}</h3>

                <span class="buyer-status">
                    ${safe(getStatus(buyer))}
                </span>

                <p>
                    <strong>Address:</strong><br>
                    ${safe(address)}
                </p>

                <p>
                    <strong>Contact Number:</strong><br>
                    ${safe(phone)}
                </p>

                <p>
                    <strong>Products / Commodities:</strong><br>
                    ${safe(getProducts(buyer))}
                </p>

                <p>
                    <strong>Additional Information:</strong><br>
                    ${safe(buyer.notes || "No additional information available.")}
                </p>

                <p>
                    <strong>Location Accuracy:</strong><br>
                    ${approximate
                        ? "Approximate area marker. This is not a confirmed exact business location."
                        : safe(getBuyerAccuracy(buyer))}
                </p>

                ${source ? `
                    <p>
                        <a href="${source}" target="_blank" rel="noopener noreferrer">
                            View Information Source
                        </a>
                    </p>
                ` : ""}

                ${phone !== "Not available" ? `
                    <a href="tel:${safe(phone)}" class="map-contact-link">
                        Contact Buyer
                    </a>
                ` : ""}

                <p class="map-note">
                    Buyer status is listed as potential. Farmers should
                    contact the buyer first to confirm current purchasing
                    requirements, accepted crops, volume, prices, delivery,
                    and payment terms.
                </p>
            </div>
        `;
    }

    function isPotentialBuyer(buyer) {
        return getStatus(buyer).toLowerCase() === "potential";
    }

    function getGeocodingQueries(buyer) {
        const queries = [];

        if (buyer.geocodeQuery) {
            queries.push(buyer.geocodeQuery);
        }

        if (buyer.address) {
            queries.push(buyer.address + ", Philippines");
        }

        if (buyer.name && buyer.address) {
            queries.push(buyer.name + ", " + buyer.address + ", Philippines");
        }

        if (buyer.name) {
            queries.push(buyer.name + ", Bukidnon, Philippines");
        }

        return [...new Set(queries.filter(Boolean))];
    }

    async function geocodeWithPhoton(query) {
        try {
            const url =
                "https://photon.komoot.io/api/?q=" +
                encodeURIComponent(query) +
                "&limit=5";

            const response = await fetch(url);

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            return data.features || [];
        } catch (error) {
            console.error("Geocoding error:", error);
            return [];
        }
    }

    function scoreLocation(feature, buyer) {
        const properties = feature.properties || {};

        const description = [
            properties.name,
            properties.city,
            properties.district,
            properties.county,
            properties.state,
            properties.country,
            properties.street,
            properties.postcode
        ].join(" ").toLowerCase();

        let score = 0;

        const name = (buyer.name || "").toLowerCase();
        const address = getBuyerAddress(buyer).toLowerCase();

        if (name && description.includes(name)) {
            score += 10;
        }

        if (address.includes("manolo fortich") &&
            description.includes("manolo fortich")) {
            score += 8;
        }

        if (address.includes("damilag") &&
            description.includes("damilag")) {
            score += 8;
        }

        if (address.includes("alae") &&
            description.includes("alae")) {
            score += 8;
        }

        if (address.includes("tankulan") &&
            description.includes("tankulan")) {
            score += 8;
        }

        if (address.includes("san miguel") &&
            description.includes("san miguel")) {
            score += 8;
        }

        if (address.includes("puerto") &&
            description.includes("puerto")) {
            score += 8;
        }

        if (address.includes("misamis oriental") &&
            description.includes("misamis oriental")) {
            score += 6;
        }

        if (address.includes("bukidnon") &&
            description.includes("bukidnon")) {
            score += 6;
        }

        if (
            properties.country &&
            properties.country.toLowerCase().includes("philippines")
        ) {
            score += 5;
        }

        if (properties.street || properties.housenumber) {
            score += 3;
        }

        return score;
    }

    function isApproximateLocation(feature, buyer) {
        const properties = feature.properties || {};

        const type = String(properties.type || "").toLowerCase();

        const broadTypes = [
            "state",
            "county",
            "district",
            "city",
            "locality",
            "municipality"
        ];

        const broadAddress =
            !buyer.geocodeQuery &&
            (!buyer.address ||
                buyer.address.toLowerCase() === "bukidnon, philippines" ||
                buyer.address.toLowerCase() === "misamis oriental, philippines");

        return broadTypes.includes(type) ||
            broadAddress ||
            Boolean(buyer.locationAccuracy &&
                buyer.locationAccuracy.toLowerCase().includes("approximate"));
    }

    function createPotentialMarker(buyer, feature) {
        const coordinates = feature.geometry.coordinates;

        const longitude = coordinates[0];
        const latitude = coordinates[1];

        const approximate = isApproximateLocation(feature, buyer);

        const marker = L.circleMarker(
            [latitude, longitude],
            {
                radius: 9,
                color: "#003013",
                weight: 2,
                fillColor: "#518044",
                fillOpacity: 0.95
            }
        );

        marker.bindTooltip(
            safe(buyer.name) +
            (approximate ? " (Approximate location)" : ""),
            {
                direction: "top"
            }
        );

        marker.bindPopup(`
            <div>
                <strong>${safe(buyer.name)}</strong>
                <br>
                ${approximate
                    ? "Approximate location"
                    : "Potential buyer"}
                <br>
                <small>Click the marker for more information.</small>
            </div>
        `);

        marker.on("click", () => {
            showBuyerInformation(buyer, approximate);
        });

        marker.addTo(buyerMap);

        buyerMarkers.push(marker);

        geocodedBuyers.push({
            buyer,
            marker,
            approximate
        });
    }

    function delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async function locateBuyer(buyer) {
        const queries = getGeocodingQueries(buyer);

        for (const query of queries) {
            const results = await geocodeWithPhoton(query);

            if (results.length > 0) {
                const sortedResults = results
                    .filter(feature =>
                        feature.geometry &&
                        feature.geometry.coordinates &&
                        feature.geometry.coordinates.length === 2
                    )
                    .sort((a, b) =>
                        scoreLocation(b, buyer) - scoreLocation(a, buyer)
                    );

                if (sortedResults.length > 0) {
                    return sortedResults[0];
                }
            }

            await delay(350);
        }

        return null;
    }

    async function loadPotentialBuyerMarkers() {
        const potentialBuyers = getBuyers().filter(isPotentialBuyer);

        geocodedBuyers = [];
        buyerMarkers = [];

        if (mapLoadStatus) {
            mapLoadStatus.textContent =
                "Locating all potential buyers...";
        }

        showMapOverview();

        for (let index = 0; index < potentialBuyers.length; index++) {
            const buyer = potentialBuyers[index];

            if (mapLoadStatus) {
                mapLoadStatus.textContent =
                    `Locating buyer ${index + 1} of ${potentialBuyers.length}: ${buyer.name}`;
            }

            const location = await locateBuyer(buyer);

            if (location) {
                createPotentialMarker(buyer, location);
            }

            await delay(1100);
        }

        if (buyerMarkers.length > 0) {
            const group = L.featureGroup(buyerMarkers);

            buyerMap.fitBounds(group.getBounds(), {
                padding: [40, 40],
                maxZoom: 13
            });
        }

        showMapOverview();

        if (mapLoadStatus) {
            const located = geocodedBuyers.length;
            const total = potentialBuyers.length;

            if (located === total) {
                mapLoadStatus.textContent =
                    `All ${total} potential buyers have map markers.`;
            } else {
                mapLoadStatus.textContent =
                    `${located} of ${total} potential buyers were located. ` +
                    `${total - located} could not be placed because the map service did not return a usable location.`;
            }
        }
    }

    function initializeMap() {
        const mapElement = document.getElementById("buyerMap");

        if (!mapElement) return;

        if (typeof L === "undefined") {
            if (mapLoadStatus) {
                mapLoadStatus.textContent =
                    "Map could not load. Please check the Leaflet library.";
            }
            return;
        }

        buyerMap = L.map("buyerMap");

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }
        ).addTo(buyerMap);

        buyerMap.setView([8.3, 124.7], 8);

        showMapOverview();

        loadPotentialBuyerMarkers();
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

    renderBuyers();
    renderPrices();
    renderCrops();
    initializeMap();
});
