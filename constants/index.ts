export const links = [
    {
        name: "GSAP Preloader",
        path: "/preloader",
        inspiration: ["https://aminezegmou.com"]
    }, {
        name: "Horizontal parallax Scroll",
        path: "/horizontalParallaxScroll",
        inspiration: ["https://camillemormal.com", "https://theshift.tokyo"]
    }
]

export const sliderData: SliderData[] = [
    {
        title: "Bad Wolf",
        img: "/images/bad-wolf.jpeg",
        url: "/"
    }, {
        title: "Boho",
        img: "/images/boho.jpg",
        url: "/"
    }, {
        title: "Maksim Dark",
        img: "/images/maksim-dark.jpg",
        url: "/"
    }, {
        title: "ndna",
        img: "/images/ndna.jpg",
        url: "/"
    }, {
        title: "snyl",
        img: "/images/snyl.jpg",
        url: "/"
    }, {
        title: "Bad Wolf",
        img: "/images/bad-wolf.jpeg",
        url: "/"
    }, {
        title: "Boho",
        img: "/images/boho.jpg",
        url: "/"
    }, {
        title: "Maksim Dark",
        img: "/images/maksim-dark.jpg",
        url: "/"
    }, {
        title: "ndna",
        img: "/images/ndna.jpg",
        url: "/"
    }, {
        title: "snyl",
        img: "/images/snyl.jpg",
        url: "/"
    }
]

export const config: config = {
    SCROLL_SPEED: 1.75,
    LERP_FACTOR: 0.05,
    MAX_VELOCITY: 150
}

export const state: state = {
    currentX: 0,
    targetX: 0,
    slideWidth: 390,
    slides: [],
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastMouseX: 0,
    lastScrollTime: Date.now(),
    isMoving: false,
    velocity: 0,
    lastCurrentX: 0,
    dragDistance: 0,
    hasActuallyDragged: false,
    isMobile: false,
}