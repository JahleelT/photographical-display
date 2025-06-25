const track = document.getElementById("image-track");

if (!track.dataset.percentage) track.dataset.percentage = "0";

const handleOnDown = e => {
    track.dataset.mouseDownAt = e.clientX;
};

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";  
    track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
    if(track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const imageCount = track.getElementsByClassName("image").length;
    const maxScrollPercentage = -100 * (imageCount - 1);

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), maxScrollPercentage);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for(const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);
window.onmouseup = e => handleOnUp(e);
window.onmousemove = e => handleOnMove(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.ontouchmove = e => handleOnMove(e.touches[0]);

const scrollHint = document.getElementById("scroll-hint");

const hideScrollHint = () => {
    if (scrollHint) scrollHint.classList.add("hidden");
};

setTimeout(hideScrollHint, 4000);
["mousedown", "touchstart"].forEach(event => 
    window.addEventListener(event, hideScrollHint, { once: true })
);