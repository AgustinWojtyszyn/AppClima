// Configuración de la API
const API_KEY = 'UJvoU5pBA1JBVgi2faTItg2siltgOCrk';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/realtime';

// Elementos del DOM
const elements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    locateBtn: document.getElementById('locate-btn'),
    location: document.getElementById('location'),
    datetime: document.getElementById('datetime'),
    temperature: document.getElementById('temperature'),
    feelsLike: document.getElementById('feels-like'),
    conditions: document.getElementById('conditions'),
    weatherIcon: document.getElementById('weather-icon'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    pressure: document.getElementById('pressure'),
    recommendation: document.getElementById('recommendation'),
    hourlyForecast: document.getElementById('hourly-forecast'),
    weatherCanvas: document.getElementById('weather-canvas'),
    weatherSound: document.getElementById('weather-sound'),
    particlesJS: document.getElementById('particles-js')
};

// Inicialización del canvas
const ctx = elements.weatherCanvas.getContext('2d');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuración de particles.js
particlesJS('particles-js', {
    "particles": {
        "number": { "value": 0 },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": false },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out"
        }
    },
    "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false } } }
});

// Mapeo de códigos meteorológicos
const WEATHER_CODES = {
    1000: { 
        description: "Despejado", 
        icon: "☀️", 
        class: "sunny-theme", 
        sound: "sunny",
        recommendation: "Día perfecto para actividades al aire libre. ¡No olvides protector solar!"
    },
    1100: { 
        description: "Mayormente despejado", 
        icon: "🌤️", 
        class: "sunny-theme", 
        sound: "sunny",
        recommendation: "Excelente día para pasear. Lleva lentes de sol por si acaso."
    },
    1101: { 
        description: "Parcialmente nublado", 
        icon: "⛅", 
        class: "cloudy-theme", 
        sound: "windy",
        recommendation: "Buen día para caminatas. Considera llevar una chaqueta ligera."
    },
    1102: { 
        description: "Mayormente nublado", 
        icon: "☁️", 
        class: "cloudy-theme", 
        sound: "windy",
        recommendation: "El clima puede cambiar. Lleva algo para cubrirte por si llueve."
    },
    1001: { 
        description: "Nublado", 
        icon: "☁️", 
        class: "cloudy-theme", 
        sound: "windy",
        recommendation: "Día gris ideal para actividades bajo techo o leer un buen libro."
    },
    2000: { 
        description: "Niebla", 
        icon: "🌫️", 
        class: "foggy-theme", 
        sound: "foggy",
        recommendation: "Conduce con precaución. La visibilidad puede ser reducida."
    },
    2100: { 
        description: "Niebla ligera", 
        icon: "🌁", 
        class: "foggy-theme", 
        sound: "foggy",
        recommendation: "Ten cuidado al conducir. Usa luces bajas si es necesario."
    },
    4000: { 
        description: "Lluvia ligera", 
        icon: "🌧️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "Lleva paraguas o impermeable. Buen día para quedarse en casa con café."
    },
    4001: { 
        description: "Lluvia intensa", 
        icon: "🌧️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "Evita salir si no es necesario. Cuidado con posibles inundaciones."
    },
    4200: { 
        description: "Lluvia ligera intermitente", 
        icon: "🌦️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "El clima puede cambiar rápidamente. Lleva paraguas plegable."
    },
    4201: { 
        description: "Lluvia intensa intermitente", 
        icon: "🌧️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "Prepara ropa seca de repuesto si debes salir. Cuidado con charcos."
    },
    5000: { 
        description: "Nieve ligera", 
        icon: "❄️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Viste ropa abrigada. Cuidado con superficies resbaladizas."
    },
    5001: { 
        description: "Nieve intensa", 
        icon: "❄️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Evita viajes innecesarios. Prepara pala para nieve si es necesario."
    },
    5100: { 
        description: "Nieve ligera intermitente", 
        icon: "🌨️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Abrígate bien. Buen día para hacer muñecos de nieve con niños."
    },
    5101: { 
        description: "Nieve intensa intermitente", 
        icon: "🌨️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Extrema precauciones al conducir. Verifica cadenas para nieve."
    },
    6000: { 
        description: "Llovizna helada", 
        icon: "🌧️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "Cuidado con el hielo en calles y aceras. Usa calzado antideslizante."
    },
    6001: { 
        description: "Lluvia helada", 
        icon: "🌧️", 
        class: "rainy-theme rainy-animation", 
        sound: "rain",
        recommendation: "Evita salir si es posible. Peligro de formación de hielo en superficies."
    },
    7000: { 
        description: "Aguanieve", 
        icon: "🌨️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Condiciones peligrosas. Posterga viajes no esenciales."
    },
    7101: { 
        description: "Granizo intenso", 
        icon: "🌨️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Protege vehículos y plantas. Evita estar al aire libre."
    },
    7102: { 
        description: "Granizo ligero", 
        icon: "🌨️", 
        class: "snowy-theme snowy-animation", 
        sound: "snow",
        recommendation: "Cuidado con el granizo al conducir. Busca refugio si es necesario."
    },
    8000: { 
        description: "Tormenta", 
        icon: "⚡", 
        class: "stormy-theme lightning-animation", 
        sound: "thunder",
        recommendation: "Evita áreas abiertas y objetos metálicos. Desconecta aparatos eléctricos."
    }
};

// Sonidos ambientales
const SOUNDS = {
    sunny: "https://assets.mixkit.co/sfx/preview/mixkit-summer-ambience-129.mp3",
    rainy: "https://assets.mixkit.co/sfx/preview/mixkit-rain-ambience-239.mp3",
    snowy: "https://assets.mixkit.co/sfx/preview/mixkit-cold-snow-wind-1253.mp3",
    windy: "https://assets.mixkit.co/sfx/preview/mixkit-wind-whistling-1363.mp3",
    foggy: "https://assets.mixkit.co/sfx/preview/mixkit-mysterious-wind-584.mp3",
    thunder: "https://assets.mixkit.co/sfx/preview/mixkit-thunder-ambience-1684.mp3"
};

// Variables de estado
let currentWeather = null;
let animationId = null;
let currentHourlyForecast = [];

// Event Listeners
elements.searchBtn.addEventListener('click', searchWeather);
elements.locateBtn.addEventListener('click', getLocationWeather);
elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

// Inicialización
updateDateTime();
setInterval(updateDateTime, 60000); // Actualizar cada minuto

// Funciones principales
function resizeCanvas() {
    elements.weatherCanvas.width = window.innerWidth;
    elements.weatherCanvas.height = window.innerHeight;
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    elements.datetime.textContent = now.toLocaleDateString('es-ES', options);
}

async function searchWeather() {
    const city = elements.cityInput.value.trim();
    if (!city) {
        alert("Por favor ingresa una ciudad");
        return;
    }
    
    try {
        showLoading(true);
        const data = await fetchWeather(city);
        currentWeather = data;
        updateUI(data);
        applyWeatherEffects(data.data.values.weatherCode);
        showLoading(false);
    } catch (error) {
        console.error("Error fetching weather:", error);
        showLoading(false);
        alert("Error al obtener datos. Verifica el nombre de la ciudad o tu conexión.");
    }
}

async function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("La geolocalización no es soportada por tu navegador");
        return;
    }
    
    try {
        showLoading(true);
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const data = await fetchWeather(`${latitude},${longitude}`);
        currentWeather = data;
        updateUI(data);
        applyWeatherEffects(data.data.values.weatherCode);
        elements.cityInput.value = data.location.name;
        showLoading(false);
    } catch (error) {
        console.error("Geolocation error:", error);
        showLoading(false);
        alert("No se pudo obtener tu ubicación. Asegúrate de haber dado los permisos necesarios.");
    }
}

async function fetchWeather(location) {
    const url = `${BASE_URL}?location=${encodeURIComponent(location)}&apikey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

function updateUI(data) {
    const values = data.data.values;
    const weatherInfo = WEATHER_CODES[values.weatherCode] || WEATHER_CODES[1000];
    
    // Actualizar elementos básicos
    elements.location.textContent = `${data.location.name}, ${data.location.country}`;
    elements.temperature.textContent = `${Math.round(values.temperature)}°`;
    elements.feelsLike.textContent = `${Math.round(values.temperatureApparent)}°`;
    elements.conditions.textContent = weatherInfo.description;
    elements.weatherIcon.textContent = weatherInfo.icon;
    elements.humidity.textContent = `${Math.round(values.humidity)}%`;
    elements.wind.textContent = `${Math.round(values.windSpeed)} km/h`;
    elements.pressure.textContent = `${Math.round(values.pressureSurfaceLevel)} hPa`;
    elements.recommendation.textContent = weatherInfo.recommendation;
    
    // Actualizar tema según la hora del día
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    if (isNight && !['stormy-theme', 'rainy-theme', 'snowy-theme'].includes(weatherInfo.class)) {
        document.body.className = 'night-theme';
    } else {
        document.body.className = weatherInfo.class;
    }
}

function applyWeatherEffects(weatherCode) {
    // Detener animaciones anteriores
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, elements.weatherCanvas.width, elements.weatherCanvas.height);
    
    // Configurar particles.js según el clima
    const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[1000];
    configureParticles(weatherCode);
    
    // Aplicar efectos de canvas según el clima
    switch(weatherCode) {
        case 4000: case 4001: case 4200: case 4201: case 6000: case 6001:
            drawRain();
            break;
        case 5000: case 5001: case 5100: case 5101: case 7000: case 7101: case 7102:
            drawSnow();
            break;
        case 8000:
            drawLightning();
            break;
        default:
            drawDefault();
    }
    
    // Reproducir sonido ambiental
    playAmbientSound(weatherInfo.sound);
}

function configureParticles(weatherCode) {
    const particles = window.particlesJS;
    
    if ([4000, 4001, 4200, 4201, 6000, 6001].includes(weatherCode)) {
        // Lluvia
        particles.particlesJS('particles-js', {
            "particles": {
                "number": { "value": 150 },
                "color": { "value": "#a4c2f4" },
                "shape": { "type": "line" },
                "opacity": { "value": 0.7 },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": false },
                "move": {
                    "enable": true,
                    "speed": 10,
                    "direction": "bottom",
                    "random": false,
                    "straight": true,
                    "out_mode": "out"
                }
            }
        });
    } else if ([5000, 5001, 5100, 5101, 7000, 7101, 7102].includes(weatherCode)) {
        // Nieve
        particles.particlesJS('particles-js', {
            "particles": {
                "number": { "value": 100 },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.8 },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": false },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "bottom",
                    "random": true,
                    "straight": false,
                    "out_mode": "out"
                }
            }
        });
    } else {
        // Despejado o otros
        particles.particlesJS('particles-js', {
            "particles": {
                "number": { "value": 0 }
            }
        });
    }
}

function drawRain() {
    const drops = [];
    const canvas = elements.weatherCanvas;
    
    // Crear gotas de lluvia
    for (let i = 0; i < 200; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.7)';
        ctx.lineWidth = 1.5;

        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = Math.random() * -50;
                drop.x = Math.random() * canvas.width;
            }
        });

        animationId = requestAnimationFrame(animate);
    }
    animate();
}

function drawSnow() {
    const flakes = [];
    const canvas = elements.weatherCanvas;
    
    // Crear copos de nieve
    for (let i = 0; i < 100; i++) {
        flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() + 0.5,
            sway: Math.random() * 0.5 - 0.25
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        flakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();

            flake.y += flake.speed;
            flake.x += flake.sway;
            
            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }
            
            if (flake.x < 0 || flake.x > canvas.width) {
                flake.sway *= -1;
            }
        });

        animationId = requestAnimationFrame(animate);
    }
    animate();
}

function drawLightning() {
    const canvas = elements.weatherCanvas;
    let lastLightning = 0;
    
    function animate() {
        const now = Date.now();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar relámpagos aleatorios
        if (now - lastLightning > 3000 && Math.random() > 0.9) {
            lastLightning = now;
            
            // Relámpago principal
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const startX = Math.random() * canvas.width;
            const startY = 0;
            let x = startX;
            let y = startY;
            
            ctx.moveTo(x, y);
            
            while (y < canvas.height) {
                x += Math.random() * 40 - 20;
                y += Math.random() * 20 + 10;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            
            // Iluminación del fondo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        animationId = requestAnimationFrame(animate);
    }
    animate();
}

function drawDefault() {
    // No hay efectos especiales para clima despejado/normal
    animationId = requestAnimationFrame(() => {});
}

function playAmbientSound(soundType) {
    if (!SOUNDS[soundType]) return;
    
    elements.weatherSound.pause();
    elements.weatherSound.src = SOUNDS[soundType];
    elements.weatherSound.volume = 0.3;
    
    // Solo reproducir si el usuario ya ha interactuado con la página
    document.body.addEventListener('click', () => {
        elements.weatherSound.play().catch(e => console.log("Audio error:", e));
    }, { once: true });
}

function showLoading(show) {
    if (show) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}

// Carga inicial
searchWeather();
