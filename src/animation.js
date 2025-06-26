const track = document.getElementById("image-track");

if (!track.dataset.percentage) track.dataset.percentage = "0";

// handling events 

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


window.onmousedown = e => handleOnDown(e);
window.onmouseup = e => handleOnUp(e);
window.onmousemove = e => handleOnMove(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.ontouchmove = e => handleOnMove(e.touches[0]);

// Show a hint on how to interact with the page

const scrollHint = document.getElementById("scroll-hint");

const hideScrollHint = () => {
    if (scrollHint) scrollHint.classList.add("hidden");
};

setTimeout(hideScrollHint, 4000);
["mousedown", "touchstart"].forEach(event => 
    window.addEventListener(event, hideScrollHint, { once: true })
);


// Show location on hover

track.dataset.hovering = 'false';

track.addEventListener("mouseenter", () => {
    track.dataset.hovering = "true";
})

track.addEventListener("mouseleave", () => {
    track.dataset.hovering = "false";
});

const wrappers = document.querySelectorAll('.image-wrapper');
const label = document.getElementById('location-label');

wrappers.forEach(wrapper => {
    wrapper.addEventListener("mouseenter", () => {
        label.textContent = wrapper.dataset.location;
        wrapper.appendChild(label);
        label.classList.remove('hidden');
    });

    wrapper.addEventListener("mouseleave", () => {
        label.classList.add('hidden'); 
    });
});