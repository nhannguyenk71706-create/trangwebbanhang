/**
 * ĐỒ ÁN MÔN FRONT-END (NĂM THỨ NHẤT)
 * Hệ thống quản lý và so sánh sản phẩm công nghệ
 * Công nghệ sử dụng: HTML5, Bootstrap 5, JavaScript Thuần (Vanilla ES6)
 */

// --- 1. HÀM TIỆN ÍCH KHỞI TẠO (UTILITIES) ---
function getUnsplashUrl(photoId, width = 400) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=75`;
}

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN") + " ₫";
}

function generateStars(rating) {
  const fullStars = Math.round(rating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Cấu hình nhãn danh mục hệ thống
const CATEGORY_META = {
  dienthoai: { label: "Điện thoại", badgeClass: "bg-success" },
  laptop:    { label: "Laptop",     badgeClass: "bg-primary" },
  tainghe:   { label: "Tai nghe",   badgeClass: "bg-warning text-dark" },
  dongho:    { label: "Đồng hồ",    badgeClass: "bg-danger" },
  loa:       { label: "Loa",        badgeClass: "bg-info text-dark" }
};

// Cấu hình các tiêu chí kỹ thuật dùng cho chức năng So sánh
const SPEC_CONFIG = {
  dienthoai: [
    { key: "manHinh", label: "Màn hình (inch)", higherBetter: true },
    { key: "pin", label: "Dung lượng pin (mAh)", higherBetter: true },
    { key: "ram", label: "RAM (GB)", higherBetter: true },
    { key: "boNhoTrong", label: "Bộ nhớ trong (GB)", higherBetter: true },
    { key: "camera", label: "Camera chính (MP)", higherBetter: true }
  ],
  laptop: [
    { key: "manHinh", label: "Màn hình (inch)", higherBetter: true },
    { key: "ram", label: "RAM (GB)", higherBetter: true },
    { key: "oCung", label: "Ổ cứng SSD (GB)", higherBetter: true },
    { key: "pinGio", label: "Thời lượng pin (giờ)", higherBetter: true },
    { key: "trongLuongKg", label: "Trọng lượng (kg)", higherBetter: false }
  ],
  tainghe: [
    { key: "pinGio", label: "Thời lượng pin (giờ)", higherBetter: true },
    { key: "chongOn", label: "Chống ồn chủ động", higherBetter: true, isBool: true }
  ],
  dongho: [
    { key: "manHinh", label: "Màn hình (inch)", higherBetter: true },
    { key: "pinNgay", label: "Thời lượng pin (ngày)", higherBetter: true }
  ],
  loa: [
    { key: "congSuat", label: "Công suất (W)", higherBetter: true },
    { key: "pinGio", label: "Thời lượng pin (giờ)", higherBetter: true }
  ]
};

// --- 2. CƠ SỞ DỮ LIỆU MẪU (MOCK DATA) ---
const PRODUCTS = [
  { id:"p1", name:"Galaxy S24 Ultra", brand:"Samsung", category:"dienthoai", price:26990000, photo: "photo-1610945265064-0e34e5519bbf",
    specs:{manHinh:6.8, pin:5000, ram:12, boNhoTrong:256, camera:200},
    desc:"Flagship Android đỉnh cao với khung viền Titanium và bút S-Pen đa năng." },
  { id:"p2", name:"iPhone 15 Pro", brand:"Apple", category:"dienthoai", price:24990000, photo: "photo-1510557880182-3d4d3cba35a5",
    specs:{manHinh:6.1, pin:3274, ram:8, boNhoTrong:128, camera:48},
    desc:"Thiết kế Dynamic Island thời thượng, tiến trình chip A17 Pro mạnh mẽ." },
  { id:"p3", name:"Xiaomi 14", brand:"Xiaomi", category:"dienthoai", price:17990000, photo: "photo-1598327105666-5b89351aff97",
    specs:{manHinh:6.36, pin:4610, ram:12, boNhoTrong:256, camera:50},
    desc:"Kích thước nhỏ gọn, ống kính quang học Leica thế hệ mới xuất sắc." },
  { id:"p4", name:"MacBook Air M2", brand:"Apple", category:"laptop", price:25490000, photo: "photo-1517336714731-489689fd1ca8",
    specs:{manHinh:13.6, ram:8, oCung:256, pinGio:18, trongLuongKg:1.24},
    desc:"Thiết kế vuông vắn mỏng nhẹ siêu mẫu, hiệu năng cực mát không cần quạt." },
  { id:"p5", name:"Asus Zenbook 14 OLED", brand:"Asus", category:"laptop", price:21990000, photo: "photo-1588872657578-7efd1f1555ed",
    specs:{manHinh:14.0, ram:16, oCung:512, pinGio:12, trongLuongKg:1.22},
    desc:"Màn hình Lumina OLED 120Hz rực rỡ, cấu hình AI thế hệ mới đa nhiệm mượt mà." },
  { id:"p7", name:"Sony WH-1000XM5", brand:"Sony", category:"tainghe", price:8490000, photo: "photo-1505740420928-5e560c06d30e",
    specs:{pinGio:30, chongOn:true},
    desc:"Khả năng chống ồn thông minh số 1 thế giới, chất âm chi tiết chuẩn Hi-Res." },
  { id:"p8", name:"AirPods Pro 2", brand:"Apple", category:"tainghe", price:5990000, photo: "photo-1600294037681-c80b4cb5b434",
    specs:{pinGio:6, chongOn:true},
    desc:"Chống ồn chủ động gấp 2 lần bản tiền nhiệm, tương thích hoàn hảo đồ Apple." },
  { id:"p10", name:"Apple Watch Series 9", brand:"Apple", category:"dongho", price:9990000, photo: "photo-1434494878577-86c23bcb06b9",
    specs:{manHinh:1.9, pinNgay:1},
    desc:"Tính năng chạm hai lần độc đáo, màn hình sáng gấp đôi, theo dõi sức khỏe chuyên sâu." },
  { id:"p13", name:"JBL Flip 6", brand:"JBL", category:"loa", price:2790000, photo: "photo-1608043152269-423dbba4e7e1",
    specs:{congSuat:30, pinGio:12},
    desc:"Hệ thống loa 2 chiều mạnh mẽ, kháng nước kháng bụi chuẩn IP67 bền bỉ." }
];

const DEFAULT_REVIEWS = {
  p1: [
    { name: "Lê Minh", stars: 5, text: "Màn hình phẳng dùng rất thích, camera zoom nét căng.", date: "2026-06-15" },
    { name: "Hoàng Vũ", stars: 4, text: "Máy hơi nặng cầm lâu mỏi tay, còn lại hoàn hảo.", date: "2026-07-02" }
  ],
  p4: [
    { name: "Khánh Linh", stars: 5, text: "Pin cực kỳ trâu bò, dùng làm tiểu luận cả ngày không hết.", date: "2026-05-20" }
  ]
};

// --- 3. QUẢN LÝ TRẠNG THÁI LƯU TRỮ CỤC BỘ (LOCALSTORAGE) ---
const storageManager = {
  get(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

let cart = storageManager.get("techvn_cart", {});
let compareList = storageManager.get("techvn_compare", []);
let productReviews = storageManager.get("techvn_reviews", DEFAULT_REVIEWS);

// Trạng thái bộ lọc toàn cục
let activeCategory = "all";
let searchTerm = "";
let sortMode = "default";

// --- 4. HÀM ĐIỀU HƯỚNG ROUTING CƠ BẢN ---
function goTo(route, param = "") {
  location.hash = param ? `#${route}/${param}` : `#${route}`;
}

function handleNavigation() {
  const hash = location.hash.replace("#", "") || "home";
  const [route, param] = hash.split("/");

  // Ẩn tất cả view
  document.querySelectorAll(".view").forEach(v => v.classList.add("d-none"));
  document.querySelectorAll(".main-nav a").forEach(a => a.classList.remove("active"));

  // Xác định route đang active để tô sáng link tương ứng trên navbar
  const activeRoute = route === "product" ? "home" : route;
  const activeLink = document.querySelector(`.main-nav a[data-route="${activeRoute}"]`);
  if (activeLink) activeLink.classList.add("active");

  // Hiển thị view tương ứng điều kiện
  if (route === "product" && param) {
    const viewProduct = document.getElementById("view-product");
    if(viewProduct) {
      viewProduct.classList.remove("d-none");
      renderProductDetail(param);
    }
  } else if (route === "compare") {
    const viewCompare = document.getElementById("view-compare");
    if(viewCompare) {
      viewCompare.classList.remove("d-none");
      renderCompareView();
    }
  } else if (route === "cart") {
    const viewCart = document.getElementById("view-cart");
    if(viewCart) {
      viewCart.classList.remove("d-none");
      renderCartView();
    }
  } else {
    const viewHome = document.getElementById("view-home");
    if(viewHome) {
      viewHome.classList.remove("d-none");
      renderProductGrid();
    }
  }
  updateBadgesAndBars();
  window.scrollTo({ top: 0, behavior: "instant" });
}
window.addEventListener("hashchange", handleNavigation);

// --- 5. LOGIC TRA CỨU & GỢI Ý TỰ ĐỘNG (SEARCH & AUTOCOMPLETE) ---
const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

if (searchInput && searchSuggestions) {
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProductGrid(); // Lọc danh sách sản phẩm ở trang chủ thời gian thực

    const query = searchTerm.trim().toLowerCase();

    // Ẩn hộp gợi ý nếu rỗng
    if (!query) {
      searchSuggestions.classList.add("d-none");
      searchSuggestions.innerHTML = "";
      return;
    }

    // Bộ lọc Autocomplete tìm kiếm (Tối đa 5 dòng kết quả)
    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length === 0) {
      searchSuggestions.innerHTML = `<div class="p-3 text-muted text-center small">Không tìm thấy sản phẩm</div>`;
      searchSuggestions.classList.remove("d-none");
      return;
    }

    // Dựng danh sách gợi ý bằng List Group của Bootstrap 5
    searchSuggestions.innerHTML = matches.map(p => `
      <a href="javascript:void(0)" class="list-group-item list-group-item-action d-flex align-items-center gap-3" onclick="selectSearchSuggestion('${p.id}')">
        <img src="${getUnsplashUrl(p.photo, 60)}" class="rounded" style="width: 40px; height: 40px; object-fit: cover;" alt="${p.name}">
        <div class="d-flex flex-column">
          <strong class="small text-dark">${p.name}</strong>
          <span class="text-muted" style="font-size: 0.75rem;">${p.brand} · <span class="text-danger font-monospace">${formatCurrency(p.price)}</span></span>
        </div>
      </a>
    `).join("");

    searchSuggestions.classList.remove("d-none");
  });

  // Đóng hộp gợi ý khi click ra vùng ngoài
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
      searchSuggestions.classList.add("d-none");
    }
  });
}

function selectSearchSuggestion(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (p) {
    searchInput.value = p.name;
    searchTerm = p.name;
    searchSuggestions.classList.add("d-none");
    goTo("product", productId);
  }
}

// --- 6. HIỂN THỊ DANH SÁCH SẢN PHẨM (HOME GRID) ---
function renderCategoryChips() {
  const container = document.getElementById("categoryChips");
  if (!container) return;

  const categories = ["all", ...Object.keys(CATEGORY_META)];
  const selectElement = document.getElementById("sortSelect");

  container.innerHTML = categories.map(c => {
    const label = c === "all" ? "Tất cả" : CATEGORY_META[c].label;
    const activeClass = c === activeCategory ? "btn-dark" : "btn-outline-secondary";
    return `<button class="btn btn-sm ${activeClass} rounded-pill me-2 mb-2" onclick="filterByCategory('${c}')">${label}</button>`;
  }).join("") + (selectElement ? selectElement.outerHTML : "");

  // Đóng lại sự kiện cho thẻ Select sau khi vẽ lại HTML
  const newSelect = document.getElementById("sortSelect");
  if (newSelect) {
    newSelect.value = sortMode;
    newSelect.addEventListener("change", (e) => {
      sortMode = e.target.value;
      renderProductGrid();
    });
  }
}

function filterByCategory(cat) {
  activeCategory = cat;
  renderProductGrid();
}

function renderProductGrid() {
  renderCategoryChips();
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  // Xử lý mảng dữ liệu (Filter & Sort)
  let list = PRODUCTS.filter(p => activeCategory === "all" || p.category === activeCategory);
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  if (sortMode === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortMode === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortMode === "rating-desc") {
    list.sort((a, b) => {
      const rA = (productReviews[a.id] || []).reduce((s, r) => s + r.stars, 0) / ((productReviews[a.id] || []).length || 1);
      const rB = (productReviews[b.id] || []).reduce((s, r) => s + r.stars, 0) / ((productReviews[b.id] || []).length || 1);
      return rB - rA;
    });
  }

  if (list.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Không có sản phẩm nào khớp với bộ lọc hiện tại.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const meta = CATEGORY_META[p.category];
    const reviews = productReviews[p.id] || [];
    const rating = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
    const isCompared = compareList.includes(p.id);

    return `
      <div class="col">
        <div class="card h-100 shadow-sm border-light position-relative">
          <span class="badge ${meta.badgeClass} position-absolute top-0 start-0 m-3 z-1">${meta.label}</span>
          <img src="${getUnsplashUrl(p.photo, 400)}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${p.name}">
          <div class="card-body d-flex flex-column p-3">
            <span class="text-uppercase tracking-wider text-muted small fw-bold mb-1" style="font-size:0.7rem">${p.brand}</span>
            <h5 class="card-title h6 fw-bold mb-2">
              <a href="#product/${p.id}" class="text-dark text-decoration-none stretched-link-skip">${p.name}</a>
            </h5>
            <div class="mb-2" style="font-size:0.85rem">
              <span class="text-warning me-1">${reviews.length ? generateStars(rating) : "☆☆☆☆☆"}</span>
              <span class="text-muted">(${reviews.length})</span>
            </div>
            <div class="mt-auto fw-bold text-danger fs-5 font-monospace mb-2">${formatCurrency(p.price)}</div>
            <div class="d-flex gap-2 position-relative z-2">
              <button class="btn btn-sm btn-primary w-100 fw-bold" onclick="addToCart('${p.id}')">Mua</button>
              <button class="btn btn-sm ${isCompared ? 'btn-dark' : 'btn-outline-secondary'}" onclick="toggleCompare('${p.id}')" title="So sánh">⇄</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
function renderProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const container = document.getElementById("productDetail");
  if (!container || !p) return;

  const meta = CATEGORY_META[p.category];
  const specConf = SPEC_CONFIG[p.category];
  const reviews = productReviews[p.id] || [];
  const rating = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const tableRows = specConf.map(s => {
    let val = p.specs[s.key];
    if (s.isBool) val = val ? "Có ✓" : "Không ✗";
    return `<tr><td class="text-muted w-50">${s.label}</td><td class="fw-bold font-monospace">${val}</td></tr>`;
  }).join("");
  const reviewsListHtml = reviews.length ? reviews.map(r => `
    <div class="border-bottom py-3">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <strong class="text-dark small">${escapeHtml(r.name)}</strong>
        <span class="text-muted font-monospace" style="font-size:0.75rem">${r.date}</span>
      </div>
      <div class="text-warning small mb-1">${generateStars(r.stars)}</div>
      <p class="text-secondary small mb-0">${escapeHtml(r.text)}</p>
    </div>
  `).join("") : `<div class="text-muted py-3 small">Chưa có đánh giá nào cho sản phẩm này.</div>`;

  container.innerHTML = `
    <div class="row g-4 mb-5">
      <div class="col-md-5">
        <img src="${getUnsplashUrl(p.photo, 600)}" class="img-fluid rounded shadow-sm" style="width:100%; max-height:360px; object-fit:cover;" alt="${p.name}">
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-primary flex-grow-1 fw-bold" onclick="addToCart('${p.id}')">Thêm vào giỏ hàng</button>
          <button class="btn btn-outline-secondary" onclick="toggleCompare('${p.id}'); renderProductDetail('${p.id}')">
            ${compareList.includes(p.id) ? "Đã chọn so sánh ✓" : "So sánh ⇄"}
          </button>
        </div>
      </div>
      <div class="col-md-7">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-2">
            <li class="breadcrumb-item"><a href="#home">Cửa hàng</a></li>
            <li class="breadcrumb-item active" aria-current="page">${meta.label}</li>
          </ol>
        </nav>
        <h1 class="h3 fw-bold">${p.name}</h1>
        <div class="mb-2">
          <span class="text-warning fs-6">${generateStars(rating)}</span>
          <span class="text-muted small">(${rating.toFixed(1)}/5 dựa trên ${reviews.length} đánh giá)</span>
        </div>
        <div class="h4 text-danger fw-bold font-monospace mb-3">${formatCurrency(p.price)}</div>
        <p class="text-secondary small">${p.desc}</p>
        <h6 class="fw-bold mt-4 border-bottom pb-2">Thông số cấu hình</h6>
        <table class="table table-sm small align-middle">${tableRows}</table>
      </div>
    </div>

    <div class="row">
      <div class="col-md-7 mb-4">
        <h5 class="fw-bold border-bottom pb-2">Nhận xét từ khách hàng</h5>
        <div>${reviewsListHtml}</div>
      </div>
      <div class="col-md-5">
        <div class="card p-3 bg-light border-0">
          <h5 class="fw-bold h6 mb-3">Gửi đánh giá của bạn</h5>
          <div class="mb-2">
            <label class="form-label small mb-1 fw-bold text-muted">Họ và tên *</label>
            <input type="text" class="form-control form-control-sm" id="reviewName" placeholder="Nhập tên của bạn">
          </div>
          <div class="mb-2">
            <label class="form-label small mb-1 fw-bold text-muted">Số sao bình chọn</label>
            <select class="form-select form-select-sm" id="reviewStars">
              <option value="5">5 Sao (Rất tốt)</option>
              <option value="4">4 Sao (Tốt)</option>
              <option value="3">3 Sao (Bình thường)</option>
              <option value="2">2 Sao (Kém)</option>
              <option value="1">1 Sao (Tệ)</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label small mb-1 fw-bold text-muted">Nội dung bình luận *</label>
            <textarea class="form-control form-control-sm" id="reviewText" rows="3" placeholder="Sản phẩm dùng tốt không bạn ơi?"></textarea>
          </div>
          <div class="alert alert-danger p-2 small d-none" id="reviewError"></div>
          <button class="btn btn-sm btn-dark fw-bold w-100" onclick="handleNewReview('${p.id}')">Gửi nhận xét</button>
        </div>
      </div>
    </div>
  `;
}

function handleNewReview(productId) {
  const nameInp = document.getElementById("reviewName");
  const textInp = document.getElementById("reviewText");
  const starSel = document.getElementById("reviewStars");
  const errBox = document.getElementById("reviewError");

  if (!nameInp || !textInp || !errBox) return;

  const name = nameInp.value.trim();
  const text = textInp.value.trim();

  if (!name || !text) {
    errBox.innerText = "Lỗi: Không được để trống họ tên và nội dung đánh giá.";
    errBox.classList.remove("d-none");
    return;
  }

  errBox.classList.add("d-none");
  const stars = parseInt(starSel.value);
  const currentDate = new Date().toISOString().split('T')[0];

  if (!productReviews[productId]) productReviews[productId] = [];
  productReviews[productId].push({ name, stars, text, date: currentDate });

  storageManager.set("techvn_reviews", productReviews);
  renderProductDetail(productId);
  renderProductGrid();
}

// --- 8. LOGIC SO SÁNH (COMPARE TABLE MATRIX) ---
function toggleCompare(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const index = compareList.indexOf(id);
  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length > 0) {
      const firstProduct = PRODUCTS.find(x => x.id === compareList[0]);
      if (firstProduct.category !== p.category) {
        alert(`Mẹo đồ án: Chỉ nên so sánh các sản phẩm cùng nhóm ngành hàng (${CATEGORY_META[firstProduct.category].label}).`);
        return;
      }
    }
    compareList.push(id);
  }
  storageManager.set("techvn_compare", compareList);
  renderProductGrid();
  updateBadgesAndBars();
}

function renderCompareView() {
  const container = document.getElementById("compareContent");
  if (!container) return;

  if (compareList.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 border border-dashed rounded bg-white">
        <p class="text-muted">Chưa chọn sản phẩm nào để đưa vào ma trận so sánh.</p>
        <a href="#home" class="btn btn-sm btn-secondary">Quay lại trang chủ</a>
      </div>`;
    return;
  }

  const activeProducts = compareList.map(id => PRODUCTS.find(x => x.id === id)).filter(Boolean);
  const currentCategory = activeProducts[0].category;
  const metrics = SPEC_CONFIG[currentCategory];

  // Logic tìm giá trị tối ưu cấu hình để làm nổi bật (Highlight)
  const optimumValues = {};
  metrics.forEach(m => {
    if (m.isBool) return;
    const numValues = activeProducts.map(p => p.specs[m.key]).filter(v => typeof v === 'number');
    if (numValues.length) {
      optimumValues[m.key] = m.higherBetter ? Math.max(...numValues) : Math.min(...numValues);
    }
  });

  // Xây dựng khung bảng ma trận so sánh bằng table Bootstrap
  let theadHtml = `<th>Tiêu chí</th>`;
  let priceRowHtml = `<tr><td class="fw-bold text-secondary bg-light">Giá bán lẻ</td>`;

  let specRows = metrics.map(m => {
    return { key: m.key, label: m.label, isBool: m.isBool, html: `<tr><td class="fw-bold text-secondary bg-light">${m.label}</td>` };
  });

  activeProducts.forEach(p => {
    theadHtml += `
      <th class="text-center" style="width: 280px;">
        <img src="${getUnsplashUrl(p.photo, 300)}" class="rounded mb-2" style="width:60px; height:60px; object-fit:cover;">
        <div class="fw-bold small text-truncate">${p.name}</div>
        <button class="btn btn-xs btn-outline-danger py-0 px-2 mt-1" style="font-size:0.75rem" onclick="toggleCompare('${p.id}'); renderCompareView();">Xóa</button>
      </th>`;

    priceRowHtml += `<td class="text-center font-monospace fw-bold text-danger">${formatCurrency(p.price)}</td>`;

    specRows.forEach(row => {
      const pVal = p.specs[row.key];
      if (row.isBool) {
        priceRowHtml += `<td class="text-center">${pVal ? "Có ✓" : "Không ✗"}</td>`; // Ghi tạm, chuẩn hóa bên dưới
      } else {
        const isOptimum = pVal === optimumValues[row.key] && activeProducts.length > 1;
        const bgClass = isOptimum ? "table-success text-success fw-bold" : "";
        row.html += `<td class="text-center font-monospace ${bgClass}">${pVal}</td>`;
      }
    });
  });

  priceRowHtml += `</tr>`;
  const tableBodyContent = priceRowHtml + specRows.map(r => r.html + `</tr>`).join("");

  container.innerHTML = `
    <div class="table-responsive bg-white shadow-sm rounded">
      <table class="table table-bordered align-middle mb-0 small">
        <thead class="table-light align-top"><tr>${theadHtml}</tr></thead>
        <tbody>${tableBodyContent}</tbody>
      </table>
    </div>
  `;
}

// --- 9. GIỎ HÀNG & ĐẶT HÀNG (SIMULATED CHECKOUT) ---
function addToCart(id) {
  if (!cart[id]) cart[id] = 0;
  cart[id]++;
  storageManager.set("techvn_cart", cart);
  updateBadgesAndBars();
  alert("Đã thêm vào giỏ hàng thành công (Lưu trữ cục bộ LocalStorage)!");
}

function updateCartQuantity(id, inputElement) {
  const quantity = parseInt(inputElement.value);
  if (isNaN(quantity) || quantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = quantity;
  }
  storageManager.set("techvn_cart", cart);
  renderCartView();
  updateBadgesAndBars();
}

function deleteCartItem(id) {
  delete cart[id];
  storageManager.set("techvn_cart", cart);
  renderCartView();
  updateBadgesAndBars();
}

function renderCartView() {
  const container = document.getElementById("cartContent");
  if (!container) return;

  const itemKeys = Object.keys(cart);
  if (itemKeys.length === 0) {
    container.innerHTML = `<div class="text-center text-muted py-5">Giỏ hàng rỗng. Hãy quay lại lựa chọn sản phẩm nhé!</div>`;
    return;
  }

  let grandTotal = 0;
  const listHtml = itemKeys.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return "";
    const itemTotal = p.price * cart[id];
    grandTotal += itemTotal;

    return `
      <div class="d-flex align-items-center justify-content-between border rounded p-3 bg-white mb-2 shadow-sm">
        <div class="d-flex align-items-center gap-3 col-6">
          <img src="${getUnsplashUrl(p.photo, 150)}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
          <div class="text-truncate">
            <h6 class="mb-0 fw-bold small"><a href="#product/${p.id}" class="text-dark text-decoration-none">${p.name}</a></h6>
            <small class="text-muted font-monospace">${formatCurrency(p.price)}</small>
          </div>
        </div>
        <div class="col-2">
          <input type="number" class="form-control form-control-sm text-center font-monospace" min="1" value="${cart[id]}" onchange="updateCartQuantity('${p.id}', this)">
        </div>
        <div class="col-3 text-end fw-bold text-danger font-monospace small">
          ${formatCurrency(itemTotal)}
        </div>
        <div class="col-1 text-end">
          <button class="btn btn-link btn-sm text-danger p-0" onclick="deleteCartItem('${p.id}')">✕</button>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div>${listHtml}</div>
    <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
      <span class="fw-bold h5">Thành tiền:</span>
      <span class="text-danger fw-bold h4 font-monospace">${formatCurrency(grandTotal)}</span>
    </div>
    <div class="text-end mt-3">
      <button class="btn btn-primary fw-bold" onclick="openCheckoutModal()">Thành toán đơn hàng</button>
    </div>
  `;
}

// --- 10. ĐIỀU KHIỂN SỰ KIỆN BADGE & TIỆN ÍCH MODAL BOOTSTRAP ---
function updateBadgesAndBars() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  
  const cartCountNode = document.getElementById("cartCount");
  const compareCountNode = document.getElementById("compareCount");
  const compareBarNode = document.getElementById("compareBar");
  const compareBarCountNode = document.getElementById("compareBarCount");

  if (cartCountNode) cartCountNode.innerText = totalItems;
  if (compareCountNode) compareCountNode.innerText = compareList.length;

  // Hiển thị thanh thông báo nổi So sánh dưới chân trang
  if (compareBarNode && compareBarCountNode) {
    if (compareList.length > 0 && !location.hash.includes("compare")) {
      compareBarCountNode.innerText = compareList.length;
      compareBarNode.classList.remove("d-none");
      compareBarNode.classList.add("d-flex");
    } else {
      compareBarNode.classList.remove("d-flex");
      compareBarNode.classList.add("d-none");
    }
  }
}

// Quản lý trạng thái đóng mở modal Bootstrap bằng JS thuần
function openCheckoutModal() {
  const modalEl = document.getElementById("checkoutModal");
  if (modalEl) modalEl.classList.add("show", "d-block");
}

function closeCheckoutModal() {
  const modalEl = document.getElementById("checkoutModal");
  if (modalEl) modalEl.classList.remove("show", "d-block");
}

function confirmOrder() {
  const name = document.getElementById("cusName").value.trim();
  const phone = document.getElementById("cusPhone").value.trim();
  const address = document.getElementById("cusAddress").value.trim();
  const errBox = document.getElementById("checkoutError");

  if (!name || !phone || !address) {
    if (errBox) {
      errBox.innerText = "Lỗi: Bạn phải nhập đủ thông tin giao hàng bắt buộc.";
      errBox.classList.remove("d-none");
    }
    return;
  }

  if (errBox) errBox.classList.add("d-none");
  alert(`Xác nhận: Đơn đặt hàng của sinh viên [${name}] đã được hệ thống ghi nhận thành công!`);
  
  cart = {};
  storageManager.set("techvn_cart", cart);
  closeCheckoutModal();
  goTo("home");
}

// --- 11. KHỞI CHẠY HỆ THỐNG (INITIALIZATION) ---
document.addEventListener("DOMContentLoaded", () => {
  updateBadgesAndBars();
  handleNavigation();
});