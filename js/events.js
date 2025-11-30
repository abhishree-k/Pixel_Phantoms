// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const API_URL = "https://script.google.com/macros/s/AKfycbyeXctRmbj5DCCOqC9gA7B7tJVRxMA-N8r9lcbZjE48KR0QHacLmFStMPKthXZpuD11/exec"; 

let allEvents = [];
let currentPage = 1;
const EVENTS_PER_PAGE = 6; 

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    initOrganizeForm();
});

// 1. Load and Render Events from Google Sheets
async function loadEvents() {
    const container = document.getElementById("events-container");

    try {
        container.innerHTML = `<p class="loading-msg">Connecting to database...</p>`;
        
        // Fetch from Google Apps Script
        const res = await fetch(API_URL);
        const data = await res.json();

        // Filter only 'Approved' events for display
        allEvents = data.filter(event => event.status === "Approved");
        
        // Setup Countdown for the nearest upcoming event
        setupCountdown(allEvents);

        // Initial Render
        renderPage(1);

    } catch (error) {
        console.error("Database Connection Failed:", error);
        container.innerHTML = `<p class="error-msg">Unable to load events at this time.</p>`;
    }
}

function renderPage(page) {
    const container = document.getElementById("events-container");
    container.innerHTML = "";
    
    const start = (page - 1) * EVENTS_PER_PAGE;
    const end = start + EVENTS_PER_PAGE;
    const eventsToShow = allEvents.slice(start, end);

    if(eventsToShow.length === 0) {
        container.innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    // Determine upcoming event logic
    const now = new Date();
    const upcoming = allEvents
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    // Create Cards
    eventsToShow.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("event-card");
        
        const isNext = upcoming && event === upcoming;
        if (isNext) card.style.borderColor = "var(--accent-color)";

        // Format Date nicely
        const dateObj = new Date(event.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        card.innerHTML = `
            ${isNext ? '<div style="color:var(--accent-color); font-weight:bold; font-size:0.8rem; margin-bottom:5px;">🔥 UP NEXT</div>' : ''}
            <h2>${event.title}</h2>
            <p class="event-date"><i class="fa-solid fa-calendar"></i> ${dateStr}</p>
            <p class="event-location"><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
            <p class="event-description">${event.description}</p>
            <a href="${event.link}" class="btn-event" target="_blank">Learn More</a>
        `;
        container.appendChild(card);
    });

    renderPaginationControls(page);
}

function renderPaginationControls(page) {
    const container = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(allEvents.length / EVENTS_PER_PAGE);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <button class="pagination-btn" ${page === 1 ? 'disabled' : ''} onclick="changePage(${page - 1})">
            <i class="fas fa-chevron-left"></i> Prev
        </button>
        <span class="page-info">Page ${page} of ${totalPages}</span>
        <button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} onclick="changePage(${page + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
}

window.changePage = function(newPage) {
    currentPage = newPage;
    renderPage(newPage);
    document.querySelector('.events-container').scrollIntoView({ behavior: 'smooth' });
};

// 2. Countdown Logic
function setupCountdown(events) {
    const now = new Date();
    const upcomingEvents = events
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingEvents.length > 0) {
        initCountdownTimer(upcomingEvents[0]);
    }
}

function initCountdownTimer(event) {
    const section = document.getElementById('countdown-section');
    const nameEl = document.getElementById('next-event-name');
    if(!section || !nameEl) return;

    const targetDate = new Date(event.date).getTime();

    section.classList.remove('countdown-hidden');
    nameEl.innerHTML = `Counting down to: <span style="color:var(--accent-color)">${event.title}</span>`;

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            section.innerHTML = "<h3>The Event Has Started! 🚀</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    };

    setInterval(updateTimer, 1000);
    updateTimer();
}

// 3. Organize Form Logic (Submits to Google Sheets)
function initOrganizeForm() {
    const form = document.getElementById('organize-form');
    const feedback = document.getElementById('organize-feedback');
    
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.disabled = true;
            btn.innerText = "Submitting...";

            // Gather Data
            const formData = {
                title: document.getElementById('event-title').value,
                type: document.getElementById('event-type').value,
                date: document.getElementById('event-date').value,
                description: document.getElementById('event-desc').value
            };

            try {
                // Send to Google Apps Script
                // We use 'no-cors' mode which sends the data but returns an opaque response
                // This is standard for simple Google Script integrations
                await fetch(API_URL, {
                    method: "POST",
                    mode: "no-cors", 
                    headers: {
                        "Content-Type": "text/plain" // Required for no-cors to simple endpoints
                    },
                    body: JSON.stringify(formData)
                });

                // Assume success if no network error occurred
                feedback.textContent = "✅ Proposal submitted! An admin will review it shortly.";
                feedback.style.color = "#00c853";
                feedback.className = "feedback-message success";
                form.reset();

            } catch (error) {
                console.error("Submission Error:", error);
                feedback.textContent = "❌ Submission failed. Please try again.";
                feedback.style.color = "#ff5f56";
                feedback.className = "feedback-message error";
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
                setTimeout(() => { 
                    feedback.textContent = ""; 
                    feedback.className = "feedback-message";
                }, 5000);
            }
        });
    }
}