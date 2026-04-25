declare global {
    interface SliderData {
        title: string;
        img: string;
        url: string;
    }

    interface config {
        SCROLL_SPEED: number,
        LERP_FACTOR: number,
        MAX_VELOCITY: number
    }

    interface state {
        currentX: number,
        targetX: number,
        slideWidth: number,
        slides: array,
        isDragging: boolean,
        startX: number,
        lastX: number,
        lastMouseX: number,
        lastScrollTime: number,
        isMoving: boolean,
        velocity: number,
        lastCurrentX: number,
        dragDistance: number,
        hasActuallyDragged: boolean,
        isMobile: boolean,
    }
}

export {};