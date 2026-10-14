/**
 * I LOVE PAMPANGA - Modern Interactive Experience
 * Main JavaScript Controller
 */

import {
  PROVINCE_INFO,
  CITIES_AND_MUNICIPALITIES,
  CULINARY_SPECIALTIES,
  HISTORIC_CHURCHES,
  TOURIST_SPOTS,
  KAPAMPANGAN_PHRASES,
  QUIZ_QUESTIONS
} from './data/pampanga-data.js';

// DOM Ready State
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderProvinceStats();
  renderCitiesDirectory(CITIES_AND_MUNICIPALITIES);
  renderCulinarySpecialties(CULINARY_SPECIALTIES);
  renderChurches(HISTORIC_CHURCHES);
  renderTouristSpots(TOURIST_SPOTS);
  renderPhrasebook(KAPAMPANGAN_PHRASES);
  initQuiz();
  initGlobalSearch();
  initScrollAnimations();
});

/* ==========================================================================
   NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar-scrolled', 'shadow-md');
    } else {
      navbar.classList.remove('navbar-scrolled', 'shadow-md');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn?.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTopBtn?.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn?.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  // Mobile Drawer Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });

    closeDrawerBtn?.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  function closeDrawer() {
    mobileDrawer?.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  // Back to top
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   PROVINCE HERO STATS
   ========================================================================== */
function renderProvinceStats() {
  const statsContainer = document.getElementById('hero-stats-container');
  if (!statsContainer) return;

  const totalBarangays = CITIES_AND_MUNICIPALITIES.reduce((acc, curr) => acc + curr.barangays.length, 0);

  statsContainer.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transform transition hover:scale-105">
        <div class="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">22</div>
        <div class="text-xs uppercase tracking-wider text-emerald-100 font-medium mt-1">Cities &amp; Towns</div>
      </div>
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transform transition hover:scale-105">
        <div class="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">${totalBarangays}</div>
        <div class="text-xs uppercase tracking-wider text-emerald-100 font-medium mt-1">Official Barangays</div>
      </div>
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transform transition hover:scale-105">
        <div class="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">1571</div>
        <div class="text-xs uppercase tracking-wider text-emerald-100 font-medium mt-1">Year Established</div>
      </div>
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-center transform transition hover:scale-105">
        <div class="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">#1</div>
        <div class="text-xs uppercase tracking-wider text-emerald-100 font-medium mt-1">Culinary Capital</div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   CITIES & MUNICIPALITIES DIRECTORY
   ========================================================================== */
let activeLguFilter = 'all';
let lguSearchQuery = '';

function renderCitiesDirectory(data) {
  const container = document.getElementById('lgus-grid');
  const countBadge = document.getElementById('lgu-count-badge');
  if (!container) return;

  const filtered = data.filter(item => {
    const matchesFilter = 
      activeLguFilter === 'all' ||
      (activeLguFilter === 'cities' && (item.type.includes('City') || item.isCapital)) ||
      (activeLguFilter === 'dist1' && item.district.includes('1st')) ||
      (activeLguFilter === 'dist2' && item.district.includes('2nd')) ||
      (activeLguFilter === 'dist3' && item.district.includes('3rd')) ||
      (activeLguFilter === 'dist4' && item.district.includes('4th'));

    const query = lguSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.foodSpecialty.toLowerCase().includes(query) ||
      item.barangays.some(b => b.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} of ${data.length} LGUs shown`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-stone-200">
        <div class="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🔍</div>
        <h4 class="text-xl font-bold text-stone-800">No city or town found</h4>
        <p class="text-stone-500 text-sm mt-1">Try refining your search keyword or clearing the district filter.</p>
        <button id="clear-lgu-filter" class="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition">Reset Search &amp; Filters</button>
      </div>
    `;
    document.getElementById('clear-lgu-filter')?.addEventListener('click', () => {
      activeLguFilter = 'all';
      lguSearchQuery = '';
      const input = document.getElementById('lgu-search-input');
      if (input) input.value = '';
      document.querySelectorAll('.lgu-filter-btn').forEach(b => b.classList.remove('bg-emerald-800', 'text-white'));
      document.querySelector('[data-lgu-filter="all"]')?.classList.add('bg-emerald-800', 'text-white');
      renderCitiesDirectory(CITIES_AND_MUNICIPALITIES);
    });
    return;
  }

  container.innerHTML = filtered.map(lgu => {
    const isCity = lgu.type.includes('City');
    const badgeBg = lgu.isCapital ? 'bg-amber-100 text-amber-900 border-amber-300' : 
                    isCity ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 
                    'bg-stone-100 text-stone-800 border-stone-200';

    return `
      <div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group" id="lgu-card-${lgu.id}">
        <!-- Card Header -->
        <div class="p-6 pb-4">
          <div class="flex items-start justify-between gap-2 mb-3">
            <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${badgeBg}">
              ${lgu.isCapital ? '⭐ Capital City' : lgu.type}
            </span>
            <span class="text-xs font-mono text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
              ZIP ${lgu.zipCode}
            </span>
          </div>

          <h3 class="text-2xl font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition">
            ${lgu.name}
          </h3>
          <p class="text-xs font-semibold text-amber-700 tracking-wide uppercase mt-1">
            ${lgu.tagline}
          </p>

          <p class="text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
            ${lgu.overview}
          </p>

          <!-- Highlights Pill Grid -->
          <div class="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs">
            <div class="flex items-center text-stone-700">
              <span class="w-20 font-semibold text-stone-500 shrink-0">🍲 Signature:</span>
              <span class="truncate text-stone-800 font-medium" title="${lgu.foodSpecialty}">${lgu.foodSpecialty}</span>
            </div>
            <div class="flex items-center text-stone-700">
              <span class="w-20 font-semibold text-stone-500 shrink-0">🏛️ Founded:</span>
              <span>Year ${lgu.founded} (${lgu.district})</span>
            </div>
            <div class="flex items-center text-stone-700">
              <span class="w-20 font-semibold text-stone-500 shrink-0">🕊️ Patron:</span>
              <span class="truncate">${lgu.patronSaint}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer with Barangay Accordion Button -->
        <div class="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div class="text-xs text-stone-500">
            <strong class="text-stone-800 font-bold">${lgu.barangays.length}</strong> Official Barangays
          </div>
          <button 
            type="button" 
            class="open-barangay-modal-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition shadow-sm"
            data-lgu-id="${lgu.id}">
            <span>Explore Barangays</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach modal trigger listeners
  document.querySelectorAll('.open-barangay-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lguId = e.currentTarget.getAttribute('data-lgu-id');
      const targetLgu = data.find(item => item.id === lguId);
      if (targetLgu) openBarangayModal(targetLgu);
    });
  });
}

// Barangay Detail Modal
function openBarangayModal(lgu) {
  const modal = document.getElementById('barangay-modal');
  const modalTitle = document.getElementById('modal-lgu-name');
  const modalSubtitle = document.getElementById('modal-lgu-subtitle') || document.getElementById('modal-lgu-tagline');
  const modalCount = document.getElementById('modal-lgu-count');
  const modalOverview = document.getElementById('modal-lgu-overview');
  const barangayListContainer = document.getElementById('modal-barangay-list');
  const searchInput = document.getElementById('modal-barangay-search');

  if (!modal) return;

  modalTitle.textContent = lgu.name;
  modalSubtitle.textContent = `${lgu.type} • ${lgu.district}`;
  modalCount.textContent = `${lgu.barangays.length} Verified Barangays`;
  modalOverview.textContent = lgu.claimToFame;

  function renderBarangayItems(filter = '') {
    const list = lgu.barangays.filter(b => b.toLowerCase().includes(filter.toLowerCase().trim()));
    barangayListContainer.innerHTML = list.map((b, idx) => `
      <div class="bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 flex items-center justify-between hover:bg-emerald-50 hover:border-emerald-200 transition">
        <span class="flex items-center gap-1.5 truncate">
          <span class="w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-[10px] flex items-center justify-center font-mono font-bold">${idx + 1}</span>
          <span class="truncate">${b}</span>
        </span>
        <span class="text-[10px] text-stone-400 font-mono">Brgy</span>
      </div>
    `).join('');

    if (list.length === 0) {
      barangayListContainer.innerHTML = `
        <div class="col-span-full py-8 text-center text-xs text-stone-400">
          No barangay matching "${filter}" in ${lgu.name}.
        </div>
      `;
    }
  }

  renderBarangayItems('');

  searchInput.value = '';
  searchInput.oninput = (e) => {
    renderBarangayItems(e.target.value);
  };

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const closeModalBtn = document.getElementById('close-barangay-modal');
  const closeModalOverlay = document.getElementById('barangay-modal-overlay');

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeModalBtn.onclick = closeModal;
  closeModalOverlay.onclick = closeModal;
}

// Hook up LGU filter buttons & search input
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.lgu-filter-btn');
  const searchInput = document.getElementById('lgu-search-input');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-800', 'text-white');
        b.classList.add('bg-white', 'text-stone-700');
      });
      e.currentTarget.classList.remove('bg-white', 'text-stone-700');
      e.currentTarget.classList.add('bg-emerald-800', 'text-white');

      activeLguFilter = e.currentTarget.getAttribute('data-lgu-filter');
      renderCitiesDirectory(CITIES_AND_MUNICIPALITIES);
    });
  });

  searchInput?.addEventListener('input', (e) => {
    lguSearchQuery = e.target.value;
    renderCitiesDirectory(CITIES_AND_MUNICIPALITIES);
  });
});

/* ==========================================================================
   CULINARY CAPITAL SHOWCASE
   ========================================================================== */
let activeFoodTag = 'all';

function renderCulinarySpecialties(data) {
  const container = document.getElementById('food-grid');
  if (!container) return;

  const filtered = data.filter(item => {
    if (activeFoodTag === 'all') return true;
    return item.tag.toLowerCase() === activeFoodTag.toLowerCase();
  });

  container.innerHTML = filtered.map(dish => {
    const tagColor = 
      dish.tag === 'Savory' ? 'bg-amber-100 text-amber-800 border-amber-300' :
      dish.tag === 'Heritage' ? 'bg-terracotta/15 text-terracotta border-terracotta/30' :
      dish.tag === 'Sweets' ? 'bg-pink-100 text-pink-800 border-pink-300' :
      dish.tag === 'Exotic' ? 'bg-purple-100 text-purple-800 border-purple-300' :
      'bg-emerald-100 text-emerald-800 border-emerald-300';

    return `
      <div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
        <!-- Content -->
        <div class="p-6 pb-4">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${tagColor}">
              ${dish.tag} • ${dish.category}
            </span>
            <span class="inline-flex items-center text-xs font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200">
              📍 ${dish.town}
            </span>
          </div>

          <h3 class="text-2xl font-bold font-serif text-stone-900 group-hover:text-amber-800 transition">
            ${dish.name}
          </h3>

          <p class="text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
            ${dish.history}
          </p>

          <!-- Ingredients Chips -->
          <div class="mt-4 pt-4 border-t border-stone-100">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Key Ingredients</div>
            <div class="flex flex-wrap gap-1.5">
              ${dish.ingredients.slice(0, 4).map(ing => `
                <span class="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200/60">${ing}</span>
              `).join('')}
              ${dish.ingredients.length > 4 ? `
                <span class="text-xs bg-stone-50 text-stone-500 px-2 py-1 rounded-lg">+${dish.ingredients.length - 4} more</span>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Footer Card Action -->
        <div class="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div class="text-xs text-stone-500 truncate max-w-[65%]">
            <span class="font-semibold text-stone-700">Where to try:</span> ${dish.whereToTry.split(',')[0]}
          </div>
          <button 
            type="button" 
            class="open-food-modal-btn inline-flex items-center gap-1 px-3 py-1.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition shadow-sm"
            data-food-id="${dish.id}">
            <span>View Story</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach modal trigger listeners
  document.querySelectorAll('.open-food-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const foodId = e.currentTarget.getAttribute('data-food-id');
      const targetDish = data.find(item => item.id === foodId);
      if (targetDish) openFoodModal(targetDish);
    });
  });
}

function openFoodModal(dish) {
  const modal = document.getElementById('food-modal');
  if (!modal) return;

  document.getElementById('modal-food-name').textContent = dish.name;
  document.getElementById('modal-food-town').textContent = `Roots: ${dish.town} • Category: ${dish.category}`;
  document.getElementById('modal-food-history').textContent = dish.history;
  document.getElementById('modal-food-fact').textContent = dish.funFact;
  document.getElementById('modal-food-where').textContent = dish.whereToTry;

  const ingredientsList = document.getElementById('modal-food-ingredients');
  ingredientsList.innerHTML = dish.ingredients.map(ing => `
    <li class="flex items-center gap-2 text-stone-700 text-xs font-medium">
      <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
      <span>${ing}</span>
    </li>
  `).join('');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.getElementById('close-food-modal').onclick = closeModal;
  document.getElementById('food-modal-overlay').onclick = closeModal;
}

// Hook food category filter pills
document.addEventListener('DOMContentLoaded', () => {
  const foodFilterBtns = document.querySelectorAll('.food-filter-btn');
  foodFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      foodFilterBtns.forEach(b => {
        b.classList.remove('bg-amber-800', 'text-white');
        b.classList.add('bg-white', 'text-stone-700');
      });
      e.currentTarget.classList.remove('bg-white', 'text-stone-700');
      e.currentTarget.classList.add('bg-amber-800', 'text-white');

      activeFoodTag = e.currentTarget.getAttribute('data-food-tag');
      renderCulinarySpecialties(CULINARY_SPECIALTIES);
    });
  });
});

/* ==========================================================================
   HISTORIC CHURCHES & RELIGIOUS HERITAGE
   ========================================================================== */
function renderChurches(data) {
  const container = document.getElementById('churches-grid');
  if (!container) return;

  container.innerHTML = data.map(church => `
    <div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1" id="church-${church.id}">
      <div class="p-6">
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            ${church.heritageStatus}
          </span>
          <span class="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
            Est. ${church.yearFounded}
          </span>
        </div>

        <h3 class="text-2xl font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition">
          ${church.name}
        </h3>
        <p class="text-xs font-semibold text-amber-700 tracking-wide uppercase mt-1">
          ${church.popularName} • ${church.town}
        </p>

        <p class="text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
          ${church.description}
        </p>

        <!-- Key Architectural Features -->
        <div class="mt-4 pt-4 border-t border-stone-100 space-y-2">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Architectural Style</div>
          <div class="text-xs font-medium text-stone-800">${church.architecturalStyle}</div>

          <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mt-2">Annual Feast Day</div>
          <div class="text-xs font-medium text-emerald-800">${church.feastDay}</div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
        <span class="text-xs text-stone-500">
          📍 ${church.coordinates}
        </span>
        <button 
          type="button" 
          class="open-church-modal-btn inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition shadow-sm"
          data-church-id="${church.id}">
          <span>Visitor Guide</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.open-church-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const churchId = e.currentTarget.getAttribute('data-church-id');
      const targetChurch = data.find(c => c.id === churchId);
      if (targetChurch) openChurchModal(targetChurch);
    });
  });
}

function openChurchModal(church) {
  const modal = document.getElementById('church-modal');
  if (!modal) return;

  document.getElementById('modal-church-name').textContent = church.name;
  document.getElementById('modal-church-popular').textContent = `${church.popularName} (${church.town})`;
  document.getElementById('modal-church-desc').textContent = church.description;
  document.getElementById('modal-church-style').textContent = church.architecturalStyle;
  document.getElementById('modal-church-feast').textContent = church.feastDay;
  document.getElementById('modal-church-mass').textContent = church.massSchedule;

  const featuresList = document.getElementById('modal-church-features');
  featuresList.innerHTML = church.keyFeatures.map(f => `
    <li class="flex items-start gap-2 text-stone-700 text-xs">
      <span class="text-emerald-700 font-bold">✓</span>
      <span>${f}</span>
    </li>
  `).join('');

  const etiquetteList = document.getElementById('modal-church-etiquette');
  etiquetteList.innerHTML = church.etiquette.map(e => `
    <li class="flex items-start gap-2 text-stone-700 text-xs">
      <span class="text-amber-600 font-bold">ℹ</span>
      <span>${e}</span>
    </li>
  `).join('');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.getElementById('close-church-modal').onclick = closeModal;
  document.getElementById('church-modal-overlay').onclick = closeModal;
}

/* ==========================================================================
   TOURIST SPOTS & ATTRACTIONS
   ========================================================================== */
function renderTouristSpots(data) {
  const container = document.getElementById('spots-grid');
  if (!container) return;

  container.innerHTML = data.map(spot => `
    <div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div class="p-6">
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            ${spot.category}
          </span>
          <span class="text-xs font-medium text-stone-500 bg-stone-50 px-2.5 py-0.5 rounded border border-stone-200">
            📍 ${spot.location}
          </span>
        </div>

        <h3 class="text-2xl font-bold font-serif text-stone-900 group-hover:text-amber-800 transition">
          ${spot.name}
        </h3>

        <p class="text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
          ${spot.description}
        </p>

        <!-- Highlights List -->
        <div class="mt-4 pt-4 border-t border-stone-100 space-y-1.5">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Key Highlights</div>
          ${spot.highlights.slice(0, 3).map(h => `
            <div class="flex items-start gap-1.5 text-xs text-stone-700">
              <span class="text-emerald-600 font-bold">•</span>
              <span class="truncate">${h}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Footer Info -->
      <div class="p-4 bg-stone-50 border-t border-stone-100 text-xs text-stone-600 space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-stone-700">Best Season:</span>
          <span>${spot.bestTime}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-semibold text-stone-700">Rates / Entry:</span>
          <span class="truncate max-w-[60%] text-right">${spot.fee}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   KAPAMPANGAN PHRASEBOOK (WITH SPEECH SYNTHESIS)
   ========================================================================== */
function renderPhrasebook(phrases) {
  const container = document.getElementById('phrasebook-grid');
  if (!container) return;

  container.innerHTML = phrases.map((item, idx) => `
    <div class="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Phrase ${idx + 1}
          </span>
          <button 
            type="button" 
            class="speak-phrase-btn p-2 rounded-xl bg-stone-50 hover:bg-amber-100 text-stone-600 hover:text-amber-900 transition flex items-center justify-center"
            data-phrase="${item.kapampangan}"
            title="Listen to pronunciation">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
        </div>

        <div class="text-xl font-bold font-serif text-stone-900 mt-2 group-hover:text-emerald-800 transition">
          "${item.kapampangan}"
        </div>
        <div class="text-sm font-semibold text-amber-800 mt-1">
          ${item.english}
        </div>
        <div class="text-xs text-stone-500 mt-0.5">
          Tagalog: ${item.tagalog}
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-400 italic">
        Context: ${item.context}
      </div>
    </div>
  `).join('');

  // Speech Synthesis audio playback
  document.querySelectorAll('.speak-phrase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const phrase = e.currentTarget.getAttribute('data-phrase');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'tl-PH'; // Tagalog/Philippine phonetic voice
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } else {
        alert(`Pronunciation: "${phrase}"`);
      }
    });
  });
}

/* ==========================================================================
   INTERACTIVE CULTURE QUIZ
   ========================================================================== */
function initQuiz() {
  const questionContainer = document.getElementById('quiz-question-container');
  const nextBtn = document.getElementById('quiz-next-btn');
  const restartBtn = document.getElementById('quiz-restart-btn');
  const progressBar = document.getElementById('quiz-progress-bar');
  const progressText = document.getElementById('quiz-progress-text');
  const scoreDisplay = document.getElementById('quiz-score-display');
  const quizCard = document.getElementById('quiz-card');
  const quizResultsCard = document.getElementById('quiz-results-card');

  if (!questionContainer) return;

  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  function loadQuestion(index) {
    hasAnswered = false;
    const q = QUIZ_QUESTIONS[index];
    if (!q) return;

    progressText.textContent = `Question ${index + 1} of ${QUIZ_QUESTIONS.length}`;
    progressBar.style.width = `${((index + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    nextBtn.classList.add('hidden');

    questionContainer.innerHTML = `
      <h4 class="text-lg sm:text-xl font-bold font-serif text-stone-900 mb-4">
        ${q.question}
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="quiz-options-grid">
        ${q.options.map((opt, optIdx) => `
          <button 
            type="button" 
            class="quiz-option-btn text-left p-4 rounded-2xl border-2 border-stone-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/50 text-stone-800 text-sm font-semibold transition"
            data-option-index="${optIdx}">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full border border-stone-300 text-stone-500 text-xs flex items-center justify-center font-bold font-mono">
                ${String.fromCharCode(65 + optIdx)}
              </span>
              <span>${opt}</span>
            </div>
          </button>
        `).join('')}
      </div>
      <div id="quiz-explanation" class="hidden mt-4 p-4 rounded-2xl text-xs leading-relaxed"></div>
    `;

    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (hasAnswered) return;
        hasAnswered = true;
        const selectedIdx = parseInt(e.currentTarget.getAttribute('data-option-index'), 10);
        const explanationEl = document.getElementById('quiz-explanation');

        document.querySelectorAll('.quiz-option-btn').forEach(b => {
          b.disabled = true;
          const idx = parseInt(b.getAttribute('data-option-index'), 10);
          if (idx === q.correctIndex) {
            b.classList.remove('border-stone-200', 'bg-white');
            b.classList.add('border-emerald-600', 'bg-emerald-100', 'text-emerald-900');
          }
        });

        if (selectedIdx === q.correctIndex) {
          score++;
          explanationEl.className = 'mt-4 p-4 rounded-2xl text-xs leading-relaxed bg-emerald-100 text-emerald-900 border border-emerald-300';
          explanationEl.innerHTML = `<strong>✨ Correct! Manyaman!</strong> ${q.explanation}`;
        } else {
          e.currentTarget.classList.remove('border-stone-200', 'bg-white');
          e.currentTarget.classList.add('border-red-500', 'bg-red-50', 'text-red-900');
          explanationEl.className = 'mt-4 p-4 rounded-2xl text-xs leading-relaxed bg-amber-50 text-amber-900 border border-amber-300';
          explanationEl.innerHTML = `<strong>Nice try!</strong> ${q.explanation}`;
        }

        explanationEl.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      });
    });
  }

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  });

  restartBtn?.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    quizResultsCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    loadQuestion(0);
  });

  function showResults() {
    quizCard.classList.add('hidden');
    quizResultsCard.classList.remove('hidden');

    let badge = '';
    let message = '';
    if (score === QUIZ_QUESTIONS.length) {
      badge = '🏆 Certified Kapampangan Connoisseur!';
      message = 'Sensational! You know Pampanga heritage like a true native. Manyaman a biye!';
    } else if (score >= 3) {
      badge = '⭐ Proud Explorer of Pampanga!';
      message = 'Impressive knowledge! You have a great appreciation for Kapampangan food, history, and culture.';
    } else {
      badge = '🌱 Pampanga Pilgrim';
      message = 'A wonderful start! Explore the guides above to discover more untold gems of Pampanga.';
    }

    scoreDisplay.innerHTML = `
      <div class="text-4xl sm:text-5xl font-extrabold text-emerald-800 font-serif mb-2">${score} / ${QUIZ_QUESTIONS.length}</div>
      <div class="text-lg font-bold text-amber-700">${badge}</div>
      <p class="text-stone-600 text-sm mt-2 max-w-md mx-auto">${message}</p>
    `;
  }

  loadQuestion(0);
}

/* ==========================================================================
   GLOBAL SEARCH & MODAL (CTRL+K / CMD+K)
   ========================================================================== */
function initGlobalSearch() {
  const searchModal = document.getElementById('global-search-modal');
  const searchModalOverlay = document.getElementById('global-search-overlay');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');
  const closeSearchBtn = document.getElementById('close-global-search');
  const openSearchBtns = document.querySelectorAll('.open-search-modal-trigger');
  const heroSearchInput = document.getElementById('hero-quick-search');

  function openModal(initialQuery = '') {
    searchModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    searchInput.value = initialQuery;
    setTimeout(() => searchInput.focus(), 50);
    performSearch(initialQuery);
  }

  function closeModal() {
    searchModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openSearchBtns.forEach(btn => btn.addEventListener('click', () => openModal('')));
  closeSearchBtn?.addEventListener('click', closeModal);
  searchModalOverlay?.addEventListener('click', closeModal);

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('hidden')) {
        openModal();
      } else {
        closeModal();
      }
    } else if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Hero Quick Search
  heroSearchInput?.addEventListener('click', () => openModal(heroSearchInput.value));
  heroSearchInput?.addEventListener('input', (e) => openModal(e.target.value));

  searchInput?.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  function performSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML = `
        <div class="py-12 text-center text-stone-400 text-xs">
          Type any town, barangay, dish, or church name above...
        </div>
      `;
      return;
    }

    const matches = [];

    // Search LGUs
    CITIES_AND_MUNICIPALITIES.forEach(lgu => {
      if (lgu.name.toLowerCase().includes(q) || lgu.tagline.toLowerCase().includes(q)) {
        matches.push({
          type: 'City / Municipality',
          title: lgu.name,
          subtitle: `${lgu.type} • ${lgu.tagline}`,
          icon: '🏛️',
          action: () => {
            closeModal();
            document.getElementById(`lgu-card-${lgu.id}`)?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }

      // Search Barangays
      lgu.barangays.forEach(brgy => {
        if (brgy.toLowerCase().includes(q)) {
          matches.push({
            type: 'Barangay',
            title: `Brgy. ${brgy}`,
            subtitle: `Located in ${lgu.name} (${lgu.type})`,
            icon: '📍',
            action: () => {
              closeModal();
              openBarangayModal(lgu);
            }
          });
        }
      });
    });

    // Search Food
    CULINARY_SPECIALTIES.forEach(food => {
      if (food.name.toLowerCase().includes(q) || food.history.toLowerCase().includes(q) || food.ingredients.some(i => i.toLowerCase().includes(q))) {
        matches.push({
          type: 'Culinary Specialty',
          title: food.name,
          subtitle: `Roots in ${food.town} • ${food.category}`,
          icon: '🍲',
          action: () => {
            closeModal();
            openFoodModal(food);
          }
        });
      }
    });

    // Search Churches
    HISTORIC_CHURCHES.forEach(church => {
      if (church.name.toLowerCase().includes(q) || church.popularName.toLowerCase().includes(q) || church.town.toLowerCase().includes(q)) {
        matches.push({
          type: 'Colonial Church',
          title: church.name,
          subtitle: `${church.popularName} • ${church.town}`,
          icon: '⛪',
          action: () => {
            closeModal();
            openChurchModal(church);
          }
        });
      }
    });

    // Search Tourist spots
    TOURIST_SPOTS.forEach(spot => {
      if (spot.name.toLowerCase().includes(q) || spot.description.toLowerCase().includes(q) || spot.location.toLowerCase().includes(q)) {
        matches.push({
          type: 'Attraction / Nature',
          title: spot.name,
          subtitle: `${spot.category} • ${spot.location}`,
          icon: '🌄',
          action: () => {
            closeModal();
            document.getElementById('attractions')?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="py-12 text-center text-stone-500 text-xs">
          No matches found for "<span class="font-bold text-stone-800">${query}</span>".
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matches.slice(0, 20).map((m, idx) => `
      <div 
        class="search-result-item p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 cursor-pointer transition flex items-center justify-between"
        data-result-index="${idx}">
        <div class="flex items-center gap-3">
          <span class="text-xl">${m.icon}</span>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-emerald-800">${m.type}</div>
            <div class="text-sm font-bold text-stone-900">${m.title}</div>
            <div class="text-xs text-stone-500">${m.subtitle}</div>
          </div>
        </div>
        <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    `).join('');

    document.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-result-index'), 10);
        if (matches[idx]) matches[idx].action();
      });
    });
  }
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(r => observer.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('active'));
  }
}
