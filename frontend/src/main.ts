import { EngineSoundSynth } from "./soundSynth";

const API_BASE = "http://localhost:5001/api/cars";

interface Car {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  hp: number;
  acceleration: number;
  top_speed: number;
  image_url: string;
  chassis_code: string;
}

let currentPage = 1;
let currentCategory = "All";
let searchQuery = "";

const carsGrid = document.getElementById("carsGrid") as HTMLDivElement;
const prevPageBtn = document.getElementById("prevPageBtn") as HTMLButtonElement;
const nextPageBtn = document.getElementById("nextPageBtn") as HTMLButtonElement;
const pageIndicator = document.getElementById("pageIndicator") as HTMLSpanElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement;

// 1. Fetch Cars with Pagination & Filter
async function fetchCars() {
  try {
    const url = new URL(API_BASE);
    url.searchParams.set("page", currentPage.toString());
    url.searchParams.set("limit", "6");
    if (currentCategory !== "All") url.searchParams.set("category", currentCategory);
    if (searchQuery) url.searchParams.set("search", searchQuery);

    const res = await fetch(url.toString());
    const data = await res.json();

    renderCars(data.data);
    updatePagination(data.page, data.totalPages);
  } catch (err) {
    carsGrid.innerHTML = `<p class="text-red-400 col-span-3 text-center">Backend серверіне қосылу мүмкін болмады. Express server іске қосулы ма?</p>`;
  }
}

// 2. Render Cards
function renderCars(cars: Car[]) {
  carsGrid.innerHTML = "";
  if (!cars || cars.length === 0) {
    carsGrid.innerHTML = `<p class="text-gray-400 col-span-3 text-center py-8">Машиналар табылмады.</p>`;
    return;
  }

  cars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "car-card glass-panel rounded-2xl overflow-hidden hover:border-gold-500/50 transition duration-300 group";
    card.innerHTML = `
      <div class="car-image-wrap relative h-48 overflow-hidden">
        <img src="${car.image_url}" alt="${car.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-gold-400 font-mono">${car.chassis_code}</span>
      </div>
      <div class="p-6">
        <h3 class="font-serif font-bold text-xl mb-1">${car.title}</h3>
        <p class="text-gold-400 font-bold text-lg mb-4">$${Number(car.price).toLocaleString()}</p>
        <div class="grid grid-cols-3 gap-2 text-center text-xs py-3 border-y border-white/10 text-gray-300">
          <div><span class="block text-gray-500">POWER</span><b>${car.hp} HP</b></div>
          <div><span class="block text-gray-500">0-100 KM/H</span><b>${car.acceleration}s</b></div>
          <div><span class="block text-gray-500">MAX SPEED</span><b>${car.top_speed} km/h</b></div>
        </div>
      </div>
    `;
    carsGrid.appendChild(card);
  });
}

// 3. Pagination & Filters listeners
function updatePagination(page: number, totalPages: number) {
  currentPage = page;
  pageIndicator.textContent = `Page ${page} of ${totalPages || 1}`;
  prevPageBtn.disabled = page <= 1;
  nextPageBtn.disabled = page >= totalPages;
}

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCars();
  }
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  fetchCars();
});

searchInput.addEventListener("input", (e) => {
  searchQuery = (e.target as HTMLInputElement).value;
  currentPage = 1;
  fetchCars();
});

categoryFilter.addEventListener("change", (e) => {
  currentCategory = (e.target as HTMLSelectElement).value;
  currentPage = 1;
  fetchCars();
});

// 4. Web Audio Engine Initializer
const synth = new EngineSoundSynth();
const startAudioBtn = document.getElementById("startAudioBtn") as HTMLButtonElement;
const revEngineBtn = document.getElementById("revEngineBtn") as HTMLButtonElement;

startAudioBtn.addEventListener("click", () => {
  synth.start();
  revEngineBtn.disabled = false;
  startAudioBtn.textContent = "Audio Engine Active";
  startAudioBtn.classList.replace("bg-gold-500", "bg-emerald-600");
});

revEngineBtn.addEventListener("click", () => {
  synth.rev();
});

// App init
fetchCars();
