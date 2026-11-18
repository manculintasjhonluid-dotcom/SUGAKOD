document.addEventListener("DOMContentLoaded", () => {
  const dummy = () => ({ innerHTML: "", textContent: "", value: "all", classList: { toggle() {}, remove() {} }, addEventListener() {}, scrollIntoView() {} });
  const $ = id => document.getElementById(id) || dummy(); // a missing element never stops the map
  const buyers = typeof buyerData !== "undefined" ? buyerData : [];
  const prices = typeof priceData !== "undefined" ? priceData : [];
  const crops = typeof cropData !== "undefined" ? cropData : [];
  const resources = typeof resourceData !== "undefined" ? resourceData : [];
  const panel = $("buyerMapPanel"), mapStatus = $("mapLoadStatus");
  let map = null;

  const safe = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  const safeUrl = v => { try { const u = new URL(v); return /^https?:$/.test(u.protocol) ? safe(u.href) : ""; } catch { return ""; } };
  const isRegional = b => (b.status || "").toLowerCase() === "regional lead";
  const products = b => (Array.isArray(b.products) ? b.products : []);
  const telHref = p => "tel:" + String(p).replace(/[^\d+]/g, "");
  const searchUrl = b => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(b.name + ", " + b.address);
  const link = (u, t) => safeUrl(u) ? `<a class="text-link" href="${safeUrl(u)}" target="_blank" rel="noopener noreferrer">${t}</a>` : "";

  // ---------- Buyer directory ----------
  function renderBuyers() {
    const q = $("buyerSearch").value.toLowerCase().trim();
    const s = $("statusFilter").value;
    const list = buyers.filter(b =>
      (s === "all" || b.status === s) &&
      [b.name, b.address, b.locationType, b.notes, b.phone, ...products(b)].join(" ").toLowerCase().includes(q));
    $("buyerList").innerHTML = list.length ? list.map(b => `
      <article class="buyer-card">
        <div class="buyer-card-top">
          <span class="buyer-icon">${isRegional(b) ? "🏭" : "🏪"}</span>
          <span class="status-badge ${isRegional(b) ? "regional" : "potential"}">${safe(b.status)}</span>
        </div>
        <h3>${safe(b.name)}</h3>
        <p class="buyer-location">📍 ${safe(b.address)}<br>📞 ${b.phone ? safe(b.phone) : "No public number listed"}</p>
        <div class="buyer-products">${products(b).map(p => `<span>${safe(p)}</span>`).join("")}</div>
        <p class="buyer-notes">${safe(b.notes)}</p>
        <p class="location-accuracy"><strong>Location:</strong> ${safe(b.locationAccuracy)}</p>
        <p class="location-accuracy">Source: ${safe(b.sourceName)}</p>
        <div class="buyer-actions">
          ${b.lat ? `<button class="text-link link-button" data-show="${b.id}">Show on map</button>` : ""}
          ${link(b.sourceUrl, "View source")}
        </div>
      </article>`).join("") : `<p class="empty-state">No buyers match your search. Try another name, place, or product.</p>`;
  }

  // ---------- Prices ----------
  function renderPrices() {
    $("priceRows").innerHTML = prices.length ? prices.map(p => {
      const cls = p.priceType.toLowerCase().replace(/[^a-z]+/g, "-");
      return `<tr>
        <td><strong>${safe(p.commodity)}</strong><div class="price-notes">${safe(p.notes)}</div></td>
        <td class="price-value">${safe(p.price)}</td><td>${safe(p.unit)}</td>
        <td><span class="price-category ${cls}">${safe(p.priceType)}</span></td>
        <td>${safe(p.location)}</td><td>${safe(p.date)}</td>
        <td>${safe(p.source)}<br>${link(p.sourceUrl, "Open source")}</td></tr>`;
    }).join("") : `<tr><td colspan="7">No price information available.</td></tr>`;
  }

  // ---------- Crops & resources ----------
  function renderCrops() {
    $("cropList").innerHTML = crops.map(c => `
      <article class="crop-card">
        <div class="crop-icon">${safe(c.icon || "🌱")}</div>
        <h3>${safe(c.name)}</h3><p>${safe(c.description)}</p>
        ${[["Planting", c.plantingReminder], ["Harvesting", c.harvestReminder], ["Market", c.marketReminder]]
          .map(([t, r]) => `<div class="crop-reminder"><strong>${t} reminder</strong><p>${safe(r)}</p></div>`).join("")}
      </article>`).join("");
  }
  function renderResources() {
    $("resourceList").innerHTML = resources.map(r => `
      <article class="resource-card"><h3>${safe(r.name)}</h3><p>${safe(r.description)}</p>
        ${r.contact ? `<p><strong>Contact:</strong> ${safe(r.contact)}</p>` : ""}
        ${safeUrl(r.url) ? link(r.url, "Visit website →") : `<p class="small-note">Link and contact details are being confirmed.</p>`}
      </article>`).join("");
  }

  // ---------- Map ----------
  const mapped = buyers.filter(b => b.lat && b.lng);
  const areas = {};
  mapped.forEach(b => (areas[b.lat + "," + b.lng] ??= []).push(b));
  const pins = []; // { buyer, marker, line, area }

  function showOverview() {
    if (map && mapped.length) map.fitBounds(mapped.map(b => [b.lat, b.lng]), { padding: [60, 60], maxZoom: 11 });
    panel.innerHTML = `<div class="panel-overview"><span class="eyebrow">MAP OVERVIEW</span><h3>Buyer Information</h3>
      <p>Every listed buyer has its own numbered pin. Select a pin or a name below to see details.</p>
      <div class="map-stat"><strong id="mappedCount">${mapped.length}</strong><span>Buyer leads marked (approximate areas)</span></div>
      <div class="map-stat"><strong id="regionalCount">${mapped.filter(isRegional).length}</strong><span>of them are regional (province-level) leads</span></div>
      ${mapped.map(b => `<div class="detail-item"><button class="text-link link-button" data-pick="${b.id}">${b.id}. ${safe(b.name)}</button></div>`).join("")}
      <p class="small-note">Pins fan out around a shared area so none are hidden. They show approximate areas, not verified business premises.</p></div>`;
  }
  function showBuyer(b) {
    const item = (t, v) => `<div class="detail-item"><strong>${t}</strong><p>${v}</p></div>`;
    panel.innerHTML = `<div class="panel-details">
      <button class="back-button" data-back>← Back to map overview</button>
      <h3>${b.id}. ${safe(b.name)}</h3><span class="status-badge ${isRegional(b) ? "regional" : "potential"}">${safe(b.status)}</span>
      ${item("Address", safe(b.address))}
      ${item("Contact number", b.phone ? `<a href="${telHref(b.phone)}">${safe(b.phone)}</a>` : "No public number listed")}
      ${item("Products", safe(products(b).join(", ")))}
      ${item("Location accuracy", "Approximate area marker. " + safe(b.locationAccuracy))}
      ${item("Additional information", safe(b.notes))}
      ${link(b.sourceUrl, "View information source")}
      <a class="btn btn-primary full-width" target="_blank" rel="noopener noreferrer"
         href="${b.coordsVerified ? `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}` : searchUrl(b)}">
         ${b.coordsVerified ? "Get directions in Google Maps" : "Search this business in Google Maps"}</a>
      <p class="small-note">Potential buyer only. Confirm accepted crops, quality standards, volume, delivery, deductions, and payment terms before travelling.</p></div>`;
    if (innerWidth <= 900) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Fan out buyers that share an area, in screen pixels, so every pin stays visible at any zoom.
  function spread() {
    pins.forEach(p => {
      const list = areas[p.area], n = list.length, i = list.indexOf(p.buyer);
      const c = map.latLngToLayerPoint([p.buyer.lat, p.buyer.lng]);
      let pos = c;
      if (n > 1) {
        const ang = (2 * Math.PI * i) / n - Math.PI / 2, r = 22 + 6 * n;
        pos = L.point(c.x + r * Math.cos(ang), c.y + r * Math.sin(ang));
      }
      const ll = map.layerPointToLatLng(pos);
      p.marker.setLatLng(ll);
      p.line.setLatLngs(n > 1 ? [[p.buyer.lat, p.buyer.lng], ll] : []);
    });
  }

  function initMap() {
    if (typeof L === "undefined") { mapStatus.textContent = "Map could not load (check your internet connection). The buyer list above still works."; showOverview(); return; }
    if (!mapped.length) mapStatus.textContent = "No buyer coordinates found. Make sure data.js is the latest version.";
    map = L.map("buyerMap").setView([8.37, 124.85], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    mapped.forEach(b => {
      const line = L.polyline([], { color: "#003013", weight: 1.5, dashArray: "3 4", opacity: 0.7 }).addTo(map);
      const marker = L.marker([b.lat, b.lng], { title: b.name, riseOnHover: true,
        icon: L.divIcon({ className: "", iconSize: [30, 30], html: `<span class="map-pin ${isRegional(b) ? "regional" : "local"}">${b.id}</span>` })
      }).addTo(map).bindTooltip(safe(b.name) + " (approximate area)", { direction: "top", offset: [0, -14] })
        .on("click", () => showBuyer(b));
      pins.push({ buyer: b, marker, line, area: b.lat + "," + b.lng });
    });
    map.on("zoomend", spread);
    showOverview();
    spread();
    mapStatus.textContent = `All ${mapped.length} of ${buyers.length} buyer leads are marked on the map (approximate areas).`;
  }

  // ---------- Events ----------
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-show],[data-back],[data-pick],[data-group]");
    if (t) {
      const find = id => buyers.find(b => b.id === Number(id));
      if ("back" in t.dataset) showOverview();
      else if (t.dataset.pick) { const b = find(t.dataset.pick); if (map) map.panTo(pins.find(p => p.buyer === b).marker.getLatLng()); showBuyer(b); }
      else if (t.dataset.show) {
        const b = find(t.dataset.show);
        $("map-section").scrollIntoView({ behavior: "smooth" });
        if (map) map.panTo(pins.find(p => p.buyer === b).marker.getLatLng());
        showBuyer(b);
      }
    }
    if (e.target.closest("#mainNav a")) $("mainNav").classList.remove("active");
  });
  $("buyerSearch").addEventListener("input", renderBuyers);
  $("statusFilter").addEventListener("change", renderBuyers);
  $("menuToggle").addEventListener("click", () => $("mainNav").classList.toggle("active"));

  [renderBuyers, renderPrices, renderCrops, renderResources, initMap].forEach(fn => {
    try { fn(); } catch (err) { console.error(fn.name + " failed:", err); }
  });
});