const particles = document.getElementById("particles");

for(let i = 0; i < 120; i++){

    const star = document.createElement("span");

    const size = Math.random() * 3;

    star.style.position = "absolute";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.background = "white";
    star.style.borderRadius = "50%";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.opacity = Math.random();

    particles.appendChild(star);
}