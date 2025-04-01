document.addEventListener("DOMContentLoaded", () => {
  // Animate skill bars
  const animateSkillBars = () => {
    document.querySelectorAll(".skill-bar").forEach((bar) => {
      const level = bar.dataset.level;
      bar.style.setProperty("--target-width", `${level}%`);
      // Force reflow to trigger transition
      void bar.offsetWidth;
      bar.classList.add("animate");
    });
  };

  // Animate timeline items on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(".timeline-item").forEach((item) => {
    observer.observe(item);
  });

  // Load GitHub projects
  const loadProjects = async () => {
    const container = document.querySelector(".project-grid");
    try {
      container.innerHTML =
        '<div class="loading-state">🚀 Loading Projects...</div>';
      const response = await fetch(
        "https://api.github.com/users/CrazyDave0522/repos"
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const projects = await response.json();
      container.innerHTML = "";

      // Filter out empty projects
      const validProjects = projects
        .filter((p) => !p.fork && !p.archived)
        .slice(0, 3);

      if (validProjects.length === 0) throw new Error("No projects found");

      validProjects.forEach((project) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || "No description available"}</p>
        <div class="project-meta">
        <a href="${project.html_url}" target="_blank">View Project</a>
    </div>
`;
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Project load error:", error);
      container.innerHTML = `
            <div class="alert alert-danger">
                ⚠️ Failed to load projects. ${error.message}
            </div>
        `;
    }
  };

  // Initialize
  animateSkillBars();
  loadProjects();
});
