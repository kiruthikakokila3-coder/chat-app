// ❤️ Floating hearts
const heartsContainer = document.getElementById("hearts");

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "💖";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

setInterval(createHeart, 300);

// 🔐 Login
function login() {
    alert("Login Success 💖");
}

// 🔗 Navigation
function go(page) {
    window.location.href = page;
}