/**
 * countdown.js — Voting Deadline Countdown Timer
 * ------------------------------------------------
 * Usage: Place a div with id="countdown-target"
 * and a data-endtime attribute containing an ISO
 * datetime string (e.g. "2025-12-31T23:59:59").
 *
 * Example:
 *   <div id="countdown-target" data-endtime="{{ settings.end_time }}"></div>
 */

(function () {
  "use strict";

  // ── Helpers ────────────────────────────────────────────────────
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function parseEndTime(raw) {
    if (!raw) return null;
    // Support both "YYYY-MM-DD HH:MM:SS" (MySQL) and ISO format
    const normalized = raw.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }

  // ── Main countdown function ────────────────────────────────────
  function initCountdown() {
    const target = document.getElementById("countdown-target");
    if (!target) return; // No countdown element on this page

    const endTime = parseEndTime(target.dataset.endtime);
    if (!endTime) {
      // No end time configured — hide the banner gracefully
      const banner = document.getElementById("countdown-banner");
      if (banner) banner.style.display = "none";
      return;
    }

    const daysEl    = document.getElementById("cd-days");
    const hoursEl   = document.getElementById("cd-hours");
    const minsEl    = document.getElementById("cd-mins");
    const secsEl    = document.getElementById("cd-secs");
    const closedEl  = document.getElementById("cd-closed");
    const timerEl   = document.getElementById("cd-timer");

    let hasReloaded = false;

    function tick() {
      const now  = new Date();
      const diff = endTime - now; // ms

      if (diff <= 0) {
        // Voting has closed
        if (timerEl)   timerEl.style.display   = "none";
        if (closedEl)  closedEl.style.display  = "block";

        // Reload the page once so the server can apply the closed state
        if (!hasReloaded) {
          hasReloaded = true;
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        }
        return; // Stop ticking
      }

      // Calculate components
      const totalSeconds = Math.floor(diff / 1000);
      const days    = Math.floor(totalSeconds / 86400);
      const hours   = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (daysEl)  daysEl.textContent  = days;
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl)  minsEl.textContent  = pad(minutes);
      if (secsEl)  secsEl.textContent  = pad(seconds);

      // Urgency — turn red in last hour
      const timerDisplay = document.getElementById("countdown-display");
      if (timerDisplay && totalSeconds < 3600) {
        timerDisplay.style.color = "#ff6b6b";
      }
    }

    // Run immediately then every second
    tick();
    setInterval(tick, 1000);
  }

  // ── Candidate card selection highlight ────────────────────────
  function initCandidateCards() {
    const cards = document.querySelectorAll(".candidate-card");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        // Deselect all
        cards.forEach(function (c) { c.classList.remove("selected"); });
        // Select clicked
        card.classList.add("selected");
        // Check the radio
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }

  // ── Vote form confirmation ─────────────────────────────────────
  function initVoteConfirmation() {
    const form = document.getElementById("vote-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      const checked = form.querySelector('input[type="radio"]:checked');
      if (!checked) {
        e.preventDefault();
        alert("Please select a candidate before submitting your vote.");
        return;
      }
      const candidateName = checked.closest(".candidate-card")
        ?.querySelector(".candidate-name")?.textContent || "selected candidate";
      const ok = confirm(
        `You are about to vote for "${candidateName}".\n\nThis action cannot be undone. Continue?`
      );
      if (!ok) e.preventDefault();
    });
  }

  // ── Auto-refresh results page ──────────────────────────────────
  function initResultsRefresh() {
    const meta = document.querySelector('meta[name="results-autorefresh"]');
    if (!meta) return;
    const interval = parseInt(meta.getAttribute("content"), 10) || 30;
    setTimeout(function () {
      window.location.reload();
    }, interval * 1000);
  }

  // ── Animate progress bars ──────────────────────────────────────
  function initProgressBars() {
    const bars = document.querySelectorAll(".result-bar-inner[data-width]");
    // Small delay so CSS transition is visible
    setTimeout(function () {
      bars.forEach(function (bar) {
        bar.style.width = bar.dataset.width + "%";
      });
    }, 200);
  }

  // ── Bootstrap tooltips ────────────────────────────────────────
  function initTooltips() {
    if (typeof bootstrap === "undefined") return;
    const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(function (el) {
      new bootstrap.Tooltip(el);
    });
  }

  // ── DOM ready ─────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    initCountdown();
    initCandidateCards();
    initVoteConfirmation();
    initResultsRefresh();
    initProgressBars();
    initTooltips();
  });
})();
