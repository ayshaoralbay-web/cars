// DATABASE MODEL
        let CAR_DATABASE = [
            {
                id: 'bugatti-tourbillon',
                name: 'Bugatti Tourbillon',
                category: 'Hypercar',
                priceUSD: 4100000,
                year: 2026,
                hp: 1800,
                accel: '2.0s',
                topSpeed: '445 km/h',
                engine: '8.3L V16 Naturally Aspirated Hybrid',
                chassisNo: 'AUR-901',
                image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#D4AF37',
                featured: true
            },
            {
                id: 'ferrari-sf90-xx',
                name: 'Ferrari SF90 XX Stradale',
                category: 'Hypercar',
                priceUSD: 890000,
                year: 2025,
                hp: 1030,
                accel: '2.3s',
                topSpeed: '320 km/h',
                engine: '4.0L V8 Twin-Turbo Plug-In',
                chassisNo: 'AUR-412',
                image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#DC2626',
                featured: true
            },
            {
                id: 'lamborghini-revuelto',
                name: 'Lamborghini Revuelto V12',
                category: 'Hypercar',
                priceUSD: 608000,
                year: 2025,
                hp: 1015,
                accel: '2.5s',
                topSpeed: '350 km/h',
                engine: '6.5L V12 + Tri-Motor Hybrid',
                chassisNo: 'AUR-731',
                image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#10B981',
                featured: true
            },
            {
                id: 'porsche-gt3-rs',
                name: 'Porsche 911 GT3 RS (992)',
                category: 'GT',
                priceUSD: 495000,
                year: 2024,
                hp: 525,
                accel: '3.2s',
                topSpeed: '296 km/h',
                engine: '4.0L Flat-6 Naturally Aspirated',
                chassisNo: 'AUR-119',
                image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#3B82F6',
                featured: false
            },
            {
                id: 'koenigsegg-jesko',
                name: 'Koenigsegg Jesko Absolut',
                category: 'Hypercar',
                priceUSD: 3400000,
                year: 2025,
                hp: 1600,
                accel: '2.5s',
                topSpeed: '531 km/h',
                engine: '5.0L Twin-Turbo Flat-Plane V8',
                chassisNo: 'AUR-050',
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#E8C86B',
                featured: false
            },
            {
                id: 'rimac-nevera',
                name: 'Rimac Nevera Time Attack',
                category: 'EV-Hyper',
                priceUSD: 2400000,
                year: 2025,
                hp: 1914,
                accel: '1.81s',
                topSpeed: '412 km/h',
                engine: 'Quad Independent Electric Motors',
                chassisNo: 'AUR-008',
                image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#2563EB',
                featured: false
            },
            {
                id: 'aston-valkyrie',
                name: 'Aston Martin Valkyrie',
                category: 'Hypercar',
                priceUSD: 3500000,
                year: 2024,
                hp: 1160,
                accel: '2.6s',
                topSpeed: '400 km/h',
                engine: '6.5L Cosworth V12 NA',
                chassisNo: 'AUR-088',
                image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#10B981',
                featured: false
            },
            {
                id: 'ferrari-purosangue',
                name: 'Ferrari Purosangue V12',
                category: 'Super-SUV',
                priceUSD: 540000,
                year: 2025,
                hp: 725,
                accel: '3.3s',
                topSpeed: '310 km/h',
                engine: '6.5L V12 Mid-Front Engine',
                chassisNo: 'AUR-990',
                image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
                colorHex: '#DC2626',
                featured: false
            }
        ];

        const API_BASE = 'http://localhost:5001/api/cars';

        // GLOBAL APP STATE
        let currentCurrency = 'USD';
        let currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79, KZT: 495 };
        let currencySymbols = { USD: '$', EUR: '€', GBP: '£', KZT: '₸' };

        let savedGarageIds = JSON.parse(localStorage.getItem('aura_garage') || '[]');
        let filteredCars = [...CAR_DATABASE];
        let currentPage = 1;
        const pageSize = 6;
        let selectedCarForModal = CAR_DATABASE[0];

        async function loadCarsFromApi() {
            try {
                const url = new URL(API_BASE);
                url.searchParams.set('limit', '100');
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Cars API returned ${response.status}`);

                const payload = await response.json();
                if (!Array.isArray(payload.data) || payload.data.length === 0) return;

                const categoryMap = { Electric: 'EV-Hyper', Sedan: 'GT', SUV: 'Super-SUV' };
                CAR_DATABASE = payload.data.map(car => ({
                    id: String(car.id),
                    name: car.title,
                    category: categoryMap[car.category] || car.category,
                    priceUSD: Number(car.price),
                    year: Number(car.year || 2026),
                    hp: Number(car.hp),
                    accel: `${car.acceleration}s`,
                    topSpeed: `${car.top_speed} km/h`,
                    engine: car.engine_type,
                    chassisNo: car.chassis_code,
                    image: car.image_url,
                    colorHex: '#D4AF37',
                    featured: Boolean(car.is_featured)
                }));
                filteredCars = [...CAR_DATABASE];
                selectedCarForModal = CAR_DATABASE[0];
                const heroCar = CAR_DATABASE.find(car => car.featured) || CAR_DATABASE[0];
                document.getElementById('heroCarImage').src = heroCar.image;
                document.getElementById('heroCarImage').alt = heroCar.name;
                document.getElementById('heroCarTitle').textContent = heroCar.name;
                document.getElementById('heroCarEngine').textContent = heroCar.engine;
                document.getElementById('heroInspectButton').onclick = () => openInspectModal(heroCar.id);
                document.getElementById('storySpecEngine').textContent = heroCar.engine;
                document.getElementById('storySpecHp').textContent = `${heroCar.hp.toLocaleString()} HP`;
                document.getElementById('storySpecAccel').textContent = heroCar.accel.toUpperCase();
                document.getElementById('storySpecSpeed').textContent = heroCar.topSpeed.toUpperCase();
            } catch (error) {
                console.warn('Cars API unavailable; showing the built-in showroom examples.', error);
            }
        }

        // INITIALIZATION
        window.onload = async function() {
            await loadCarsFromApi();
            renderFeaturedGrid();
            applyFilters();
            updateGarageBadges();
            populateConciergeCarSelect();
            initMapCanvas();
            initSoundCanvas();
        };

        // VIEW ROUTER
        function switchView(viewName) {
            document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
            document.getElementById(`view-${viewName}`).classList.remove('hidden');

            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-champagne', 'border-b-2', 'border-champagne');
                btn.classList.add('text-gray-300');
            });

            const activeBtn = document.getElementById(`nav-${viewName}`);
            if (activeBtn) {
                activeBtn.classList.add('text-champagne', 'border-b-2', 'border-champagne');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (viewName === 'garage') renderGarageView();
        }

        function toggleMobileMenu() {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        }

        // CURRENCY ENGINE
        function switchCurrency(curr) {
            currentCurrency = curr;
            renderFeaturedGrid();
            renderShowroomGrid();
            if (!document.getElementById('view-garage').classList.contains('hidden')) renderGarageView();
        }

        function formatCurrency(usd) {
            const rate = currencyRates[currentCurrency] || 1;
            const symbol = currencySymbols[currentCurrency] || '$';
            return symbol + Math.round(usd * rate).toLocaleString();
        }

        // TOAST SYSTEM
        function showNotification(msg) {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = "aura-card p-4 gold-border-glow text-xs font-mono-tag text-champagne flex items-center gap-3 shadow-2xl transition-all duration-300";
            toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        // CARD HTML BUILDER
        function createAuraCardHtml(car) {
            const isSaved = savedGarageIds.includes(car.id);
            return `
            <div class="aura-card p-5 flex flex-col justify-between">
                <div>
                    <!-- Header Badges -->
                    <div class="flex items-center justify-between mb-3 text-xs font-mono-tag">
                        <span class="font-mono-tag text-[10px] text-champagne">CHASSIS #${car.chassisNo}</span>
                        <button onclick="toggleGarage('${car.id}')" class="text-gray-400 hover:text-champagne transition">
                            <i class="${isSaved ? 'fa-solid text-champagne' : 'fa-regular'} fa-bookmark"></i>
                        </button>
                    </div>

                    <!-- Image -->
                    <div class="img-zoom h-48 bg-carbonPanel mb-4 border border-titaniumBorder cursor-pointer" onclick="openInspectModal('${car.id}')">
                        <img src="${car.image}" alt="${car.name}" onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'" class="w-full h-full object-cover">
                    </div>

                    <!-- Title & Spec -->
                    <div class="font-mono-tag text-[9px] text-gray-500 uppercase tracking-widest">${car.category} • ${car.year}</div>
                    <h3 class="font-display text-xl text-white font-bold hover:text-champagne transition cursor-pointer" onclick="openInspectModal('${car.id}')">
                        ${car.name}
                    </h3>

                    <!-- Specs Bar -->
                    <div class="grid grid-cols-3 gap-2 my-4 p-2 bg-obsidian border border-titaniumBorder text-center font-mono-tag text-[11px]">
                        <div>
                            <div class="text-gray-500 text-[9px]">POWER</div>
                            <div class="text-champagne font-bold">${car.hp} HP</div>
                        </div>
                        <div>
                            <div class="text-gray-500 text-[9px]">0-100</div>
                            <div class="text-emeraldLive font-bold">${car.accel}</div>
                        </div>
                        <div>
                            <div class="text-gray-500 text-[9px]">TOP SPEED</div>
                            <div class="text-white font-bold">${car.topSpeed}</div>
                        </div>
                    </div>
                </div>

                <!-- Footer Price & Action -->
                <div class="flex items-center justify-between pt-3 border-t border-titaniumBorder">
                    <div>
                        <div class="font-mono-tag text-[9px] text-gray-500">OFFERING</div>
                        <div class="font-display text-lg text-champagne font-bold">${formatCurrency(car.priceUSD)}</div>
                    </div>
                    <button onclick="openInspectModal('${car.id}')" class="px-3 py-2 border border-champagne/40 text-champagne hover:bg-champagne hover:text-obsidian font-mono-tag text-xs transition">
                        Inspect
                    </button>
                </div>
            </div>`;
        }

        function renderFeaturedGrid() {
            const featured = CAR_DATABASE.filter(c => c.featured);
            document.getElementById('homeFeaturedGrid').innerHTML = featured.map(createAuraCardHtml).join('');
        }

        // SHOWROOM FILTERING & PAGINATION
        function applyFilters() {
            const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
            const category = document.getElementById('categoryFilter')?.value || 'ALL';
            const maxPrice = parseFloat(document.getElementById('priceSlider')?.value || 5000000);
            const sortBy = document.getElementById('sortBy')?.value || 'featured';

            filteredCars = CAR_DATABASE.filter(car => {
                const matchesQuery = car.name.toLowerCase().includes(query) || car.engine.toLowerCase().includes(query);
                const matchesCategory = (category === 'ALL') || car.category === category;
                const matchesPrice = car.priceUSD <= maxPrice;
                return matchesQuery && matchesCategory && matchesPrice;
            });

            if (sortBy === 'price-asc') filteredCars.sort((a,b) => a.priceUSD - b.priceUSD);
            if (sortBy === 'price-desc') filteredCars.sort((a,b) => b.priceUSD - a.priceUSD);
            if (sortBy === 'hp-desc') filteredCars.sort((a,b) => b.hp - a.hp);

            currentPage = 1;
            renderShowroomGrid();
        }

        function setFilterCategoryPill(cat) {
            document.getElementById('categoryFilter').value = cat;
            applyFilters();
        }

        function updatePriceSliderDisplay(val) {
            document.getElementById('priceDisplay').textContent = formatCurrency(parseFloat(val));
        }

        function renderShowroomGrid() {
            const container = document.getElementById('showroomGrid');
            if (!container) return;

            const totalPages = Math.ceil(filteredCars.length / pageSize) || 1;
            const startIndex = (currentPage - 1) * pageSize;
            const pagedCars = filteredCars.slice(startIndex, startIndex + pageSize);

            container.innerHTML = pagedCars.map(createAuraCardHtml).join('');

            document.getElementById('showroomPaginationInfo').textContent = `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, filteredCars.length)} of ${filteredCars.length} allocations`;

            let btns = '';
            for (let i = 1; i <= totalPages; i++) {
                btns += `<button onclick="goToPage(${i})" class="w-8 h-8 font-mono-tag text-xs ${i === currentPage ? 'bg-champagne text-obsidian font-bold' : 'border border-titaniumBorder text-gray-300'} transition">${i}</button>`;
            }
            document.getElementById('showroomPaginationBtns').innerHTML = btns;
        }

        function goToPage(p) {
            currentPage = p;
            renderShowroomGrid();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }

        // HERO ENGINE TEASER
        function playHeroEngineTeaser() {
            const icon = document.getElementById('teaserSoundIcon');
            icon.className = "fa-solid fa-spinner animate-spin text-xs";
            pressThrottle();
            setTimeout(() => {
                releaseThrottle();
                icon.className = "fa-solid fa-volume-high text-xs";
            }, 1200);
        }

        // 360° ATELIER CONTROLLER
        let atelierAngle = 0;
        function setAtelierAngle(idx) {
            atelierAngle = parseInt(idx);
            document.getElementById('atelierAngleDeg').textContent = `${atelierAngle * 45}°`;
            document.getElementById('atelierCarImg').style.transform = `scaleX(${atelierAngle % 2 === 0 ? 1 : -1})`;
        }
        function rotateAtelier(dir) {
            let next = (atelierAngle + dir + 8) % 8;
            setAtelierAngle(next);
        }
        function setAtelierColor(hex, name, filter) {
            document.getElementById('atelierColorName').textContent = name;
            document.getElementById('atelierCarImg').style.filter = filter;
        }
        function toggleAtelierWing() {
            showNotification("Carbon Wing actuate state updated");
        }
        function showHotspotPopover(part) {
            const title = document.getElementById('hotspotTitle');
            const body = document.getElementById('hotspotBody');
            if (part === 'aero') {
                title.textContent = "1. Carbon Active Rear Wing";
                body.textContent = "Hydraulic twin-pylon aero wing generating up to 530kg downforce.";
            } else {
                title.textContent = "2. Hybrid Powertrain Inverter";
                body.textContent = "Tri-motor axial flux electric powertrain operating on 800V architecture.";
            }
        }

        // WEB AUDIO API SOUND SYNTH & TACHOMETER
        let audioCtx = null, osc = null, gainNode = null;
        let isThrottlePressed = false;
        let currentRpm = 1200;

        function setSynthProfile(type) {
            document.querySelectorAll('.synth-profile-btn').forEach(btn => {
                btn.className = "synth-profile-btn px-5 py-2.5 bg-obsidian text-gray-300 border border-titaniumBorder font-mono-tag text-xs font-bold uppercase hover:border-champagne transition";
            });
            document.getElementById(`btn-synth-${type}`).className = "synth-profile-btn px-5 py-2.5 bg-champagne text-obsidian font-mono-tag text-xs font-bold uppercase transition gold-glow";
        }

        function pressThrottle() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            osc = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(480, audioCtx.currentTime + 1.5);

            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.1);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();

            isThrottlePressed = true;
            animateRpm();
        }

        function releaseThrottle() {
            if (gainNode) {
                gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
                setTimeout(() => { try { osc.stop(); } catch(e){} }, 400);
            }
            isThrottlePressed = false;
        }

        function animateRpm() {
            if (isThrottlePressed && currentRpm < 9000) {
                currentRpm += 160;
                document.getElementById('rpmDisplay').textContent = currentRpm.toLocaleString();
                document.getElementById('rpmBar').style.width = `${(currentRpm / 9000) * 100}%`;
                requestAnimationFrame(animateRpm);
            } else if (!isThrottlePressed && currentRpm > 1200) {
                currentRpm -= 110;
                document.getElementById('rpmDisplay').textContent = currentRpm.toLocaleString();
                document.getElementById('rpmBar').style.width = `${(currentRpm / 9000) * 100}%`;
                requestAnimationFrame(animateRpm);
            }
        }

        function initSoundCanvas() {
            const canvas = document.getElementById('soundCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            function draw() {
                ctx.fillStyle = '#181920';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#D4AF37';
                ctx.beginPath();

                const sliceWidth = canvas.width / 50;
                let x = 0;
                for (let i = 0; i < 50; i++) {
                    const y = (canvas.height / 2) + (isThrottlePressed ? (Math.random() - 0.5) * 45 : (Math.random() - 0.5) * 6);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    x += sliceWidth;
                }
                ctx.stroke();
                requestAnimationFrame(draw);
            }
            draw();
        }

        // VALUATION WIZARD
        function goToValuationStep(step) {
            document.getElementById('valStep1').classList.add('hidden');
            document.getElementById('valStep2').classList.add('hidden');
            document.getElementById('valStep3').classList.add('hidden');

            document.getElementById(`valStep${step}`).classList.remove('hidden');
        }

        function computeValuationResult() {
            const brand = document.getElementById('valBrand').value;
            const year = parseInt(document.getElementById('valYear').value);
            const condition = parseFloat(document.getElementById('valCondition').value);

            let base = 1200000;
            if (brand === 'Bugatti') base = 3200000;
            if (brand === 'Ferrari') base = 850000;

            const offer = base * (1 - (2026 - year) * 0.05) * condition;
            document.getElementById('valuationOutput').textContent = formatCurrency(offer);
            goToValuationStep(3);
        }

        // GARAGE & COMPARISON
        function toggleGarage(id) {
            if (savedGarageIds.includes(id)) {
                savedGarageIds = savedGarageIds.filter(x => x !== id);
                showNotification("Removed from Garage");
            } else {
                savedGarageIds.push(id);
                showNotification("Saved to Private Garage");
            }
            localStorage.setItem('aura_garage', JSON.stringify(savedGarageIds));
            updateGarageBadges();
            renderFeaturedGrid();
            renderShowroomGrid();
        }

        function updateGarageBadges() {
            document.getElementById('garageBadge').textContent = savedGarageIds.length;
        }

        function clearGarage() {
            savedGarageIds = [];
            localStorage.removeItem('aura_garage');
            updateGarageBadges();
            renderGarageView();
        }

        function renderGarageView() {
            const empty = document.getElementById('garageEmptyState');
            const content = document.getElementById('garageContent');
            const grid = document.getElementById('garageGrid');
            const table = document.getElementById('comparisonTable');

            const cars = CAR_DATABASE.filter(c => savedGarageIds.includes(c.id));

            if (cars.length === 0) {
                empty.classList.remove('hidden');
                content.classList.add('hidden');
                return;
            }

            empty.classList.add('hidden');
            content.classList.remove('hidden');

            grid.innerHTML = cars.map(createAuraCardHtml).join('');

            table.innerHTML = `
            <thead>
                <tr class="border-b border-titaniumBorder text-champagne">
                    <th class="py-3 px-4">SPECIFICATION</th>
                    ${cars.map(c => `<th class="py-3 px-4 text-white">${c.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr class="border-b border-titaniumBorder">
                    <td class="py-3 px-4 text-gray-500">OFFERING PRICE</td>
                    ${cars.map(c => `<td class="py-3 px-4 font-bold text-champagne">${formatCurrency(c.priceUSD)}</td>`).join('')}
                </tr>
                <tr class="border-b border-titaniumBorder">
                    <td class="py-3 px-4 text-gray-500">HORSEPOWER</td>
                    ${cars.map(c => `<td class="py-3 px-4">${c.hp} HP</td>`).join('')}
                </tr>
                <tr class="border-b border-titaniumBorder">
                    <td class="py-3 px-4 text-gray-500">0-100 KM/H</td>
                    ${cars.map(c => `<td class="py-3 px-4 text-emeraldLive">${c.accel}</td>`).join('')}
                </tr>
                <tr class="border-b border-titaniumBorder">
                    <td class="py-3 px-4 text-gray-500">TOP SPEED</td>
                    ${cars.map(c => `<td class="py-3 px-4 text-white">${c.topSpeed}</td>`).join('')}
                </tr>
            </tbody>`;
        }

        // INSPECT MODAL
        function openInspectModal(carId) {
            const car = CAR_DATABASE.find(c => c.id === carId);
            if (!car) return;

            selectedCarForModal = car;
            document.getElementById('inspectTitle').textContent = car.name;
            document.getElementById('inspectCategory').textContent = car.category;
            document.getElementById('inspectChassis').textContent = `CHASSIS #${car.chassisNo}`;
            document.getElementById('inspectPrice').textContent = formatCurrency(car.priceUSD);
            document.getElementById('inspectImg').src = car.image;
            document.getElementById('inspectHp').textContent = `${car.hp} HP`;
            document.getElementById('inspectAccel').textContent = car.accel;
            document.getElementById('inspectSpeed').textContent = car.topSpeed;
            document.getElementById('inspectEngine').textContent = car.engine;

            document.getElementById('inspectModal').classList.remove('hidden');
        }

        function closeInspectModal() {
            document.getElementById('inspectModal').classList.add('hidden');
        }

        function bookCurrentModalCar() {
            closeInspectModal();
            switchView('concierge');
            document.getElementById('conciergeCarSelect').value = selectedCarForModal.name;
        }

        // CONCIERGE & MAP
        function populateConciergeCarSelect() {
            const sel = document.getElementById('conciergeCarSelect');
            if (sel) {
                sel.innerHTML = CAR_DATABASE.map(c => `<option value="${c.name}">${c.name} (${formatCurrency(c.priceUSD)})</option>`).join('');
            }
        }

        function handleConciergeSubmit(e) {
            e.preventDefault();
            showNotification("VIP Reservation Request Transmitted. Concierge will reach out within 15 minutes.");
        }

        function initMapCanvas() {
            const canvas = document.getElementById('mapCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            ctx.fillStyle = '#08080A';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const nodes = [
                { x: 0.25, y: 0.35, name: "Monaco" },
                { x: 0.60, y: 0.45, name: "Dubai" },
                { x: 0.20, y: 0.30, name: "London" },
                { x: 0.85, y: 0.40, name: "Tokyo" },
                { x: 0.28, y: 0.32, name: "Zurich" }
            ];

            nodes.forEach(n => {
                const px = n.x * canvas.width;
                const py = n.y * canvas.height;

                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#D4AF37";
                ctx.fill();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "10px Space Grotesk";
                ctx.fillText(n.name, px + 10, py + 3);
            });
        }

