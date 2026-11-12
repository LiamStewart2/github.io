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

    const titles = document.querySelectorAll(".PP_project-section");

    titles.forEach(title => {
        title.addEventListener("click", () => {

            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                return; // User is selecting text
            }

            const section = title.closest(".PP_project-section");
            const content = section.querySelector(".PP_project-description-content");
            const isExpanded = section.classList.contains("active");

            if (isExpanded) {
                // COLLAPSE
                content.style.maxHeight = content.scrollHeight + "px"; // Set current height
                // Force reflow
                content.offsetHeight; 
                content.style.maxHeight = "0px";
                section.classList.remove("active");
            } else {
                // EXPAND
                section.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";

                // Remove max-height after animation to allow auto-resizing
                content.addEventListener("transitionend", function handler() {
                    content.style.maxHeight = "none";
                    content.removeEventListener("transitionend", handler);
                });
            }
        });
    });
});
