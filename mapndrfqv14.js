<div class="map-wrap">
  <div id="map"></div>
</div>

<style>
  .map-wrap {
    aspect-ratio: 16 / 9;   /* bikin responsif */
    width: 100%;
    max-width: 1100px;      /* opsional */
    margin: auto;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0,0,0,.06);
  }
  /* anak div harus isi penuh wrapper */
  #map { width: 100%; height: 100%; }
  /* sentuh lebih nyaman di mobile */
  .gm-style img { max-width: none; }
</style>

<script>
  // ---- Lazy-load script saat elemen masuk viewport ----
  const mapContainer = document.querySelector('#map');
  let map, marker;

  const loadScript = (cb) => {
    if (window.google && window.google.maps) { cb(); return; }
    const s = document.createElement('script');
    // Ganti YOUR_API_KEY
    s.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=__initMap&v=weekly";
    s.async = true; s.defer = true;
    window.__initMap = cb;
    document.head.appendChild(s);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        loadScript(initMap);
        io.disconnect();
      }
    });
  }, { rootMargin: "200px" });
  io.observe(mapContainer);

  // ---- Tema gelap/terang otomatis ----
  const darkStyle = [
    { elementType: "geometry", stylers: [{color: "#1f2937"}] },
    { elementType: "labels.text.fill", stylers: [{color: "#e5e7eb"}] },
    { elementType: "labels.text.stroke", stylers: [{color: "#111827"}] },
    { featureType: "poi", stylers: [{visibility:"off"}] },
    { featureType: "road", stylers: [{color:"#374151"}] },
    { featureType: "water", stylers: [{color:"#0ea5e9"}] }
  ];

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function initMap() {
    const center = { lat: -6.200000, lng: 106.816666 }; // Jakarta
    map = new google.maps.Map(document.getElementById("map"), {
      center,
      zoom: 12,
      gestureHandling: "greedy", // enak di mobile
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: prefersDark.matches ? darkStyle : null
    });

    marker = new google.maps.Marker({
      position: center,
      map,
      title: "ZERO HQ (contoh)"
    });

    // Responsif + tetap jaga pusat peta saat resize
    let lastCenter = center;
    map.addListener("idle", () => { lastCenter = map.getCenter(); });
    window.addEventListener("resize", () => { map.setCenter(lastCenter); });

    // Ganti tema bila user ubah mode terang/gelap
    prefersDark.addEventListener("change", (e) => {
      map.setOptions({ styles: e.matches ? darkStyle : null });
    });
  }
</script>

<!-- Fallback untuk user non-JS -->
<noscript>
  <a href="https://maps.google.com/?q=Jakarta" rel="nofollow">Lihat peta Jakarta</a>
</noscript>
