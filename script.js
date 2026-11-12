document.addEventListener("DOMContentLoaded", function () {
    // Project card videos only download and play while on screen,
    // instead of every video autoplaying (and downloading) on page load.
    const lazyVideos = document.querySelectorAll("video[data-play-when-visible]");
    const tryPlay = video => { const p = video.play(); if (p) p.catch(() => {}); };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) tryPlay(entry.target);
                else entry.target.pause();
            });
        }, { rootMargin: "200px 0px" });
        lazyVideos.forEach(video => observer.observe(video));
    } else {
        lazyVideos.forEach(tryPlay);
    }

    // ---- Collapsible project sections ----
    const sections = Array.from(document.querySelectorAll(".PP_project-section"));
    const expandAllButton = document.querySelector(".PP_expand-all");

    function setOpen(section, open) {
        const title = section.querySelector(".PP_project-section-title");
        const content = section.querySelector(".PP_project-description-content");
        if (section.classList.contains("active") === open) return;

        title.setAttribute("aria-expanded", String(open));

        if (open) {
            section.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
            // Release the fixed height once the animation is done so lazy-loaded
            // images can grow the section. The timeout covers reduced-motion,
            // where no transition (and so no transitionend) happens.
            const release = () => { if (section.classList.contains("active")) content.style.maxHeight = "none"; };
            content.addEventListener("transitionend", release, { once: true });
            setTimeout(release, 300);
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            content.offsetHeight; // force reflow so the collapse animates
            content.style.maxHeight = "0px";
            section.classList.remove("active");
        }
    }

    function updateExpandAllLabel() {
        if (!expandAllButton) return;
        const allOpen = sections.every(s => s.classList.contains("active"));
        expandAllButton.textContent = allOpen ? "Collapse all" : "Expand all";
    }

    sections.forEach(section => {
        const title = section.querySelector(".PP_project-section-title");
        // Only the title row toggles, so clicking inside open content
        // (code, links, images) doesn't snap the section shut.
        title.setAttribute("role", "button");
        title.setAttribute("tabindex", "0");
        title.setAttribute("aria-expanded", "false");

        const toggle = () => {
            setOpen(section, !section.classList.contains("active"));
            updateExpandAllLabel();
        };
        title.addEventListener("click", toggle);
        title.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
        });
    });

    if (expandAllButton) {
        expandAllButton.addEventListener("click", () => {
            const open = !sections.every(s => s.classList.contains("active"));
            sections.forEach(s => setOpen(s, open));
            updateExpandAllLabel();
        });
    }
});
