const $ = (s) => document.querySelector(s);

// Theme toggle
const themeBtn = $("#themeToggle") || $("#themeToggleAdmin");
if (themeBtn) {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.body.classList.add("light-mode");
    updateThemeIcon();
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
        updateThemeIcon();
    });
}
function updateThemeIcon() {
    const b = $("#themeToggle") || $("#themeToggleAdmin");
    if (b) b.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
}

// Local storage
function getPosts() {
    return JSON.parse(localStorage.getItem("posts") || "[]");
}
function savePosts(p) {
    localStorage.setItem("posts", JSON.stringify(p));
}

// Index page render
const postsEl = $("#posts");
if (postsEl) {
    renderPosts();
}
function renderPosts() {
    const posts = getPosts();
    postsEl.innerHTML = "";
    posts.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
      <div class="post-card-img-wrapper"> 
          <img src="${p.image}" alt="${p.title}" />
      </div>
      <div class="post-overlay">
        <h3>${p.title}</h3>
        <p>${p.content.substring(0, 80)}...</p>
      </div>`;
        card.addEventListener("click", () => openModal(p));
        postsEl.appendChild(card);
    });
}

// Modal
const modal = $("#postModal");
if (modal) {
    const modalImg = $("#modalImg"),
        modalTitle = $("#modalTitle"),
        modalText = $("#modalText"),
        closeBtn = $(".close");
    closeBtn.onclick = () => (modal.style.display = "none");
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
    function openModal(p) {
        modalImg.src = p.image;
        modalTitle.textContent = p.title;
        modalText.textContent = p.content;
        modal.style.display = "block";
    }
}

// Admin logic
const form = $("#postForm");
if (form) {
    const adminPosts = $("#admin-posts");
    const editIndex = $("#editIndex");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("#title").value.trim();
        const content = $("#content").value.trim();
        const file = $("#imageInput").files[0];
        const posts = getPosts();
        const idx = editIndex.value;

        const saveData = (img) => {
            // Using a better placeholder image for 16:9 ratio
            const post = { title, content, image: img || "https://via.placeholder.com/640x360" }; 
            if (idx) posts[idx] = post;
            else posts.push(post);
            savePosts(posts);
            form.reset();
            editIndex.value = "";
            loadAdminPosts();
            alert(idx ? "Post updated!" : "Post added!");
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => saveData(e.target.result);
            reader.readAsDataURL(file);
        } else {
            saveData(posts[idx]?.image);
        }
    });

    function loadAdminPosts() {
        const posts = getPosts();
        adminPosts.innerHTML = "";
        posts.forEach((p, i) => {
            const div = document.createElement("div");
            div.className = "admin-post";
            div.innerHTML = `
        <strong>${p.title}</strong>
        <div>
          <button class="edit" data-i="${i}">Edit</button>
          <button class="del" data-i="${i}">Del</button>
        </div>`;
            adminPosts.appendChild(div);
        });
        adminPosts.querySelectorAll(".edit").forEach((b) =>
            b.addEventListener("click", (e) => {
                const i = e.target.dataset.i;
                const p = getPosts()[i];
                $("#title").value = p.title;
                $("#content").value = p.content;
                editIndex.value = i;
                window.scrollTo(0, 0);
            })
        );
        adminPosts.querySelectorAll(".del").forEach((b) =>
            b.addEventListener("click", (e) => {
                const i = e.target.dataset.i;
                const posts = getPosts();
                posts.splice(i, 1);
                savePosts(posts);
                loadAdminPosts();
            })
        );
    }
    loadAdminPosts();
}

// Year
$("#year").textContent = new Date().getFullYear();
