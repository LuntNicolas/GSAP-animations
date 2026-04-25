import React from 'react'
import {links} from "@/constants";
import Link from 'next/link'

const Page = () => {
    return (
        <section id="hero">
            <div className="hero-container">
                <h1>GSAP Animations</h1>
                <ul>
                    {links.map((link) => (
                        <li key={link.name}>
                            <div className="list-element">
                                <h3>{link.name}</h3>
                                <Link href={link.path}>{link.name}</Link>
                                {link.inspiration.map((url, index) => (
                                    <Link key={index} href={url} target="_blank">
                                        {url.substring(8, url.length)}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
