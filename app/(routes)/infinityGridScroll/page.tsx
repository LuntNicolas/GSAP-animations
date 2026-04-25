"use client"

import React, {useRef, useState, useEffect, useCallback} from 'react';
// import { sliderData } from "@/constants";
import {motion, useScroll, useTransform, useSpring, useInView, AnimatePresence} from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Artist {
    id: number;
    name: string;
    role: string;
    origin: string;
    img: string;
    accent: string;
    tags: string[];
    bio: string;
}

interface ExhibitLabelProps {
    children: React.ReactNode;
    align?: "left" | "right";
}

interface ArtistPanelProps {
    artist: Artist;
    index: number;
    total: number;
    isActive: boolean;
    onHover: (id: number | null) => void;
}

// ── Placeholder data (replace with: import { sliderData } from "@/constants") ─

const sliderData: Artist[] = [
    {
        id: 1,
        name: "Aleksandra Voss",
        role: "Sound Architect",
        origin: "Berlin, DE",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80",
        accent: "#c8a96e",
        tags: ["Modular Synthesis", "Dark Ambient", "Ritual"],
        bio: "Constructs sonic environments from the periphery of human perception."
    },
    {
        id: 2,
        name: "Marek Solís",
        role: "Ritual Composer",
        origin: "Prague, CZ",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80",
        accent: "#8fa8c8",
        tags: ["Industrial", "Drone", "Ceremony"],
        bio: "His compositions exist between silence and controlled collapse."
    },
    {
        id: 3,
        name: "Yuki Tanaka",
        role: "Frequency Sculptor",
        origin: "Osaka, JP",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80",
        accent: "#a8c8a0",
        tags: ["Wabi-Sabi", "Noise", "Contemplation"],
        bio: "Finds beauty in the impermanence of sound's decay."
    },
    {
        id: 4,
        name: "Léa Fontaine",
        role: "Textural Minimalist",
        origin: "Lyon, FR",
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80",
        accent: "#c8a0b8",
        tags: ["Concrete", "Spatial", "Reduction"],
        bio: "Removes until only the essential vibration remains."
    },
    {
        id: 5,
        name: "Caden North",
        role: "Signal Cartographer",
        origin: "Detroit, US",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
        accent: "#c8b8a0",
        tags: ["Industrial Heritage", "Machine Soul", "Depth"],
        bio: "Maps the emotional geography of mechanical resonance."
    },
    {
        id: 6,
        name: "Nadia Stein",
        role: "Void Cartographer",
        origin: "Vienna, AT",
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80",
        accent: "#a0b8c8",
        tags: ["Hypnagogia", "Ceremonial", "Archive"],
        bio: "Documents the architecture of states between waking and sleep."
    }
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const pad = (n: number): string => String(n).padStart(2, '0');

// ── Grain overlay ──────────────────────────────────────────────────────────────

const GrainOverlay: React.FC = () => (
    <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
    >
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
);

// ── Exhibit label ──────────────────────────────────────────────────────────────

const ExhibitLabel: React.FC<ExhibitLabelProps> = ({children, align = "left"}) => (
    <div className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <div className="h-px bg-current opacity-20 flex-1"/>
        <span className="text-[10px] tracking-[0.3em] opacity-40 uppercase font-light">{children}</span>
    </div>
);

// ── Artist panel ───────────────────────────────────────────────────────────────

const ArtistPanel: React.FC<ArtistPanelProps> = ({artist, index, total, isActive, onHover}) => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, {amount: 0.4, once: false});
    const [hovered, setHovered] = useState<boolean>(false);

    const handleHover = (state: boolean): void => {
        setHovered(state);
        onHover(state ? artist.id : null);
    };

    const isEven = index % 2 === 0;

    return (
        <section
            ref={ref}
            className="relative min-h-screen w-full flex items-center justify-center px-8 md:px-16 lg:px-24"
            style={{paddingTop: '8rem', paddingBottom: '8rem'}}
        >
            {/* Large background index number */}
            <motion.div
                className="absolute select-none pointer-events-none font-thin text-white"
                style={{
                    fontSize: 'clamp(8rem, 20vw, 18rem)',
                    lineHeight: 1,
                    [isEven ? 'right' : 'left']: '-0.05em',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0.025,
                    letterSpacing: '-0.05em',
                    fontFamily: "'Georgia', serif",
                }}
                initial={{opacity: 0}}
                animate={{opacity: isInView ? 0.025 : 0}}
                transition={{duration: 1.2, ease: "easeOut"}}
            >
                {pad(index + 1)}
            </motion.div>

            <div className={`
        relative z-10 w-full max-w-7xl mx-auto
        grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center
        ${isEven ? '' : 'direction-rtl'}
      `}>
                {/* Image Column */}
                <motion.div
                    className={`lg:col-span-7 relative overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                    initial={{opacity: 0, y: 60}}
                    animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 60}}
                    transition={{duration: 1.1, ease: [0.16, 1, 0.3, 1]}}
                    onMouseEnter={() => handleHover(true)}
                    onMouseLeave={() => handleHover(false)}
                >
                    <div
                        className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[3/4] overflow-hidden group cursor-pointer">

                        {/* Reveal mask */}
                        <motion.div
                            className="absolute inset-0 bg-[#0a0a0a] z-10 origin-top"
                            initial={{scaleY: 1}}
                            animate={isInView ? {scaleY: 0} : {scaleY: 1}}
                            transition={{duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.1}}
                        />

                        {/* Artist image */}
                        <motion.img
                            src={artist.img}
                            alt={artist.name}
                            className="w-full h-full object-cover object-top"
                            style={{filter: 'grayscale(30%) contrast(1.05)'}}
                            animate={hovered ? {scale: 1.04} : {scale: 1}}
                            transition={{duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
                        />

                        {/* Accent color wash on hover */}
                        <motion.div
                            className="absolute inset-0 mix-blend-color"
                            style={{backgroundColor: artist.accent}}
                            initial={{opacity: 0}}
                            animate={{opacity: hovered ? 0.15 : 0}}
                            transition={{duration: 0.8}}
                        />

                        {/* Bottom gradient */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>

                        {/* Hover: Tags overlay */}
                        <AnimatePresence>
                            {hovered && (
                                <motion.div
                                    className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2"
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 10}}
                                    transition={{duration: 0.4, ease: "easeOut"}}
                                >
                                    {artist.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] tracking-[0.25em] uppercase px-3 py-1 border border-white/30 text-white/70 backdrop-blur-sm"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Corner accents */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-white/20"/>
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-white/20"/>
                    </div>
                </motion.div>

                {/* Text Column */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center`}>

                    <motion.div
                        initial={{opacity: 0, x: isEven ? 40 : -40}}
                        animate={isInView ? {opacity: 1, x: 0} : {opacity: 0, x: isEven ? 40 : -40}}
                        transition={{duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2}}
                    >
                        <ExhibitLabel align={isEven ? "left" : "right"}>
                            Exhibition № {pad(index + 1)}
                        </ExhibitLabel>
                    </motion.div>

                    {/* Artist name */}
                    <div className="mt-6 mb-4 overflow-hidden">
                        <motion.h2
                            className="font-light leading-none text-white"
                            style={{
                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                letterSpacing: '-0.02em',
                            }}
                            initial={{y: '100%', opacity: 0}}
                            animate={isInView ? {y: '0%', opacity: 1} : {y: '100%', opacity: 0}}
                            transition={{duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.35}}
                        >
                            {artist.name}
                        </motion.h2>
                    </div>

                    {/* Role */}
                    <motion.div
                        className="overflow-hidden mb-8"
                        initial={{opacity: 0, y: 20}}
                        animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.5}}
                    >
                        <p
                            className="uppercase tracking-[0.35em] text-[11px] font-light"
                            style={{color: artist.accent}}
                        >
                            {artist.role}
                        </p>
                    </motion.div>

                    {/* Bio */}
                    <motion.p
                        className="text-white/50 font-light leading-relaxed text-sm md:text-base mb-8"
                        style={{fontFamily: "'Georgia', serif", fontStyle: 'italic'}}
                        initial={{opacity: 0}}
                        animate={isInView ? {opacity: 1} : {opacity: 0}}
                        transition={{duration: 1.2, delay: 0.6}}
                    >
                        "{artist.bio}"
                    </motion.p>

                    {/* Origin & divider */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={isInView ? {opacity: 1} : {opacity: 0}}
                        transition={{duration: 1, delay: 0.75}}
                    >
                        <div className="h-px bg-white/10 mb-4"/>
                        <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/30">
                {artist.origin}
              </span>
                            <motion.div
                                className="w-8 h-8 border border-white/15 flex items-center justify-center cursor-pointer"
                                whileHover={{borderColor: artist.accent, scale: 1.05}}
                                transition={{duration: 0.3}}
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                        d="M1 6h10M7 2l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="0.8"
                                        className="text-white/40"
                                    />
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Section divider */}
            {index < total - 1 && (
                <div className="absolute bottom-0 left-8 right-8 h-px bg-white/5"/>
            )}
        </section>
    );
};

// ── Main page ──────────────────────────────────────────────────────────────────

const Page: React.FC = () => {
    // import { sliderData } from "@/constants";

    const containerRef = useRef<HTMLElement>(null);
    const {scrollYProgress} = useScroll({target: containerRef});
    const smoothProgress = useSpring(scrollYProgress, {stiffness: 80, damping: 20});

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({x: 0, y: 0});

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v: number) => {
            const idx = Math.round(v * (sliderData.length - 1));
            setCurrentIndex(Math.min(Math.max(idx, 0), sliderData.length - 1));
        });
        return unsubscribe;
    }, [scrollYProgress]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>): void => {
        setCursorPos({x: e.clientX, y: e.clientY});
    }, []);

    const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
    const hoveredArtist = sliderData.find((a: Artist) => a.id === hoveredId);

    return (
        <main
            ref={containerRef}
            className="bg-[#0a0a0a] text-[#f5f5f5] selection:bg-white selection:text-black relative"
            style={{cursor: 'none'}}
            onMouseMove={handleMouseMove}
        >
            <GrainOverlay/>

            {/* Custom cursor */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
                style={{x: cursorPos.x - 6, y: cursorPos.y - 6}}
                transition={{type: "spring", stiffness: 500, damping: 30}}
            >
                <motion.div
                    className="rounded-full bg-white"
                    animate={{
                        width: hoveredId ? 48 : 12,
                        height: hoveredId ? 48 : 12,
                        x: hoveredId ? -18 : 0,
                        y: hoveredId ? -18 : 0,
                    }}
                    transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
                />
            </motion.div>

            {/* Fixed header */}
            <motion.header
                className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 py-6"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1, ease: "easeOut", delay: 0.3}}
            >
                <div>
                    <p className="text-[10px] tracking-[0.45em] uppercase text-white/40 font-light">
                        Gallery / Exhibition
                    </p>
                    <h1
                        className="text-white font-light tracking-tight leading-none mt-0.5"
                        style={{
                            fontFamily: "'Georgia', serif",
                            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        The Artists
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <motion.div
                        className="text-white/40 text-[11px] tracking-[0.3em] tabular-nums"
                        key={currentIndex}
                        initial={{opacity: 0, y: 4}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                    >
                        {pad(currentIndex + 1)}&thinsp;/&thinsp;{pad(sliderData.length)}
                    </motion.div>

                    <div className="hidden md:flex items-center gap-2">
                        {sliderData.map((_: Artist, i: number) => (
                            <motion.div
                                key={i}
                                className="rounded-full bg-white transition-all duration-500"
                                animate={{
                                    width: i === currentIndex ? 20 : 4,
                                    height: 4,
                                    opacity: i === currentIndex ? 0.7 : 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.header>

            {/* Progress line */}
            <div className="fixed top-0 left-0 right-0 h-[1px] bg-white/5 z-50">
                <motion.div className="h-full bg-white/30" style={{width: progressWidth}}/>
            </div>

            {/* Opening title screen */}
            <motion.section
                className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1.5, ease: "easeOut"}}
            >
                <motion.p
                    className="text-[10px] tracking-[0.6em] uppercase text-white/30 mb-6"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5, duration: 0.8}}
                >
                    A curated exhibition
                </motion.p>
                <motion.h1
                    className="text-white font-thin leading-none"
                    style={{
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        fontSize: 'clamp(3rem, 8vw, 8rem)',
                        letterSpacing: '-0.04em',
                    }}
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1]}}
                >
                    The Artists
                </motion.h1>
                <motion.div
                    className="mt-8 h-px w-24 bg-white/20 mx-auto"
                    initial={{scaleX: 0}}
                    animate={{scaleX: 1}}
                    transition={{delay: 1.2, duration: 0.8}}
                />
                <motion.p
                    className="mt-6 text-white/30 text-sm font-light tracking-wider"
                    style={{fontFamily: "'Georgia', serif", fontStyle: 'italic'}}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1.5, duration: 0.8}}
                >
                    Scroll to enter the exhibition
                </motion.p>

                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    animate={{opacity: [0.3, 0.8, 0.3]}}
                    transition={{repeat: Infinity, duration: 2.5, ease: "easeInOut"}}
                >
                    <div className="w-px h-12 bg-white/20"/>
                    <div className="w-1 h-1 rounded-full bg-white/30"/>
                </motion.div>
            </motion.section>

            {/* Artist panels */}
            {sliderData.map((artist: Artist, index: number) => (
                <ArtistPanel
                    key={artist.id}
                    artist={artist}
                    index={index}
                    total={sliderData.length}
                    isActive={currentIndex === index}
                    onHover={setHoveredId}
                />
            ))}

            {/* Closing section */}
            <motion.section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-8 pb-16">
                <div className="h-px w-24 bg-white/10 mb-12 mx-auto"/>
                <p className="text-white/20 text-[11px] tracking-[0.5em] uppercase mb-4">
                    End of Exhibition
                </p>
                <p
                    className="text-white/10 text-xs tracking-[0.3em]"
                    style={{fontFamily: "'Georgia', serif", fontStyle: 'italic'}}
                >
                    © The Gallery — All rights reserved
                </p>
            </motion.section>

            {/* Ambient accent glow */}
            <AnimatePresence>
                {hoveredArtist && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-0"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 1}}
                        style={{
                            background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${hoveredArtist.accent}08, transparent 70%)`
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
};

export default Page;