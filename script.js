document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll(".PP_project-section");

    titles.forEach(title => {
        title.addEventListener("click", () => {
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
