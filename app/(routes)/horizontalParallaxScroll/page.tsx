"use client"

import React, {useEffect, useRef} from 'react'
import {sliderData} from "@/constants"
import Link from "next/link"

const Page = () => {
    const trackRef = useRef<HTMLDivElement>(null)
    const imgRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        // How far the track can scroll horizontally
        const getMaxScroll = () => track.scrollWidth - track.clientWidth

        const onScroll = () => {
            const scrollX = track.scrollLeft
            const maxScroll = getMaxScroll()
            // progress: 0 (start) → 1 (end)
            const progress = maxScroll > 0 ? scrollX / maxScroll : 0

            imgRefs.current.forEach((img, i) => {
                if (!img) return

                // Each card's center relative to viewport while scrolling
                const card = img.parentElement!
                const cardLeft = card.offsetLeft - scrollX
                const cardCenter = cardLeft + card.offsetWidth / 2
                const viewCenter = window.innerWidth / 2

                // Offset from center: negative = card is left, positive = card is right
                const offset = (cardCenter - viewCenter) / window.innerWidth

                // Image shifts opposite to direction: creates lag-behind effect
                // Multiply by 80 to control parallax intensity
                const shift = offset * 180
                img.style.transform = `translateX(${shift}px)`
            })
        }

        track.addEventListener("scroll", onScroll, {passive: true})
        // Run once to set initial state
        onScroll()

        return () => track.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <>
            {/* Nav */}
            <nav
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0,
                    zIndex: 50,
                    display: "flex",
                    justifyContent: "center",
                    gap: "4rem",
                    padding: "2rem",
                    pointerEvents: "none",
                }}
            >
                {["Work", "Studio", "Back"].map((label, i) => (
                    <a
                        key={label}
                        href={i === 2 ? "/" : "#"}
                        style={{
                            color: i === 0 ? "white" : "rgba(255,255,255,0.4)",
                            textDecoration: "none",
                            fontSize: "0.8rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            pointerEvents: "all",
                        }}
                    >
                        {label}
                    </a>
                ))}
            </nav>

            {/*
              THE SCROLLER:
              - width: 100vw, height: 100vh  → fills screen
              - overflow-x: scroll           → native horizontal scroll
              - overflow-y: hidden
              - no GSAP needed
            */}
            <div
                ref={trackRef}
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflowX: "scroll",
                    overflowY: "hidden",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#141414",
                    // Hide scrollbar visually
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    cursor: "grab",
                }}
                // Also hide webkit scrollbar via className
                className="hide-scrollbar"
            >
                {/* Inner flex row – wider than viewport */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        gap: "1.25rem",
                        paddingLeft: "8vw",
                        paddingRight: "8vw",
                        height: "100%",
                    }}
                >
                    {sliderData.map((item, i) => (
                        <Link
                            href={item.url}
                            key={i}
                            style={{
                                position: "relative",
                                flexShrink: 0,
                                width: "clamp(180px, 20vw, 300px)",
                                height: "clamp(260px, 52vh, 480px)",
                                overflow: "hidden",
                                borderRadius: "2px",
                                display: "block",
                            }}
                        >
                            {/* Image – 40% wider than card so it has room to shift */}
                            <div
                                ref={(el) => {
                                    imgRefs.current[i] = el
                                }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: "-20%",
                                    width: "140%",
                                    height: "100%",
                                    willChange: "transform",
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        pointerEvents: "none",
                                        userSelect: "none",
                                    }}
                                    draggable={false}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Counter */}
            <div
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.35em",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            >
                1 — {sliderData.length}
            </div>

            {/* Footer */}
            <footer style={{position: "fixed", bottom: "1.75rem", left: "2.5rem", zIndex: 50}}>
                <p style={{
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase"
                }}>
                    Experiment 1
                </p>
            </footer>
            <footer style={{position: "fixed", bottom: "1.75rem", right: "2.5rem", zIndex: 50}}>
                <p style={{
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase"
                }}>
                    Built By Lennart Lunt
                </p>
            </footer>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </>
    )
}

export default Page