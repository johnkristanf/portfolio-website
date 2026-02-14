'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import ContactSection from '@/components/contact'
import { handleNavClick } from '@/lib/utils'
import SocialMedia from '@/components/social-media'
import Projects from '@/components/projects'
import ChatWidget from '@/components/chat-widget'

export default function Home() {
    const [isClient, setIsClient] = useState(false)
    const pathname = usePathname()

    // Add state to prevent rapid route changes
    const [isNavigating, setIsNavigating] = useState(false)

    const handleRouteNavigation = useCallback(() => {
        const currentPath = pathname
        let targetSection = 'home'

        if (currentPath === '/about') targetSection = 'about'
        else if (currentPath === '/skills') targetSection = 'skills'
        else if (currentPath === '/projects') targetSection = 'projects'
        else if (currentPath === '/contact') targetSection = 'contact'

        const section = document.getElementById(targetSection)
        if (section) {
            setIsNavigating(true)
            setTimeout(() => {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
                // Reset navigation state after scroll completes
                setTimeout(() => setIsNavigating(false), 1000)
            }, 100)
        }
    }, [pathname])

    useEffect(() => {
        setIsClient(true)

        // Scroll event listener for navigation background
        const handleScroll = () => {
            const nav = document.querySelector('nav')
            if (nav) {
                if (window.scrollY > 100) {
                    nav.style.background = 'rgba(0, 0, 0, 0.9)'
                } else {
                    nav.style.background = 'rgba(139, 92, 246, 0.1)'
                }
            }
        }

        window.addEventListener('scroll', handleScroll)

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [pathname, isNavigating, handleRouteNavigation])

    if (!isClient) {
        return null // or a loading spinner
    }

    return (
        <>
            <Navbar setIsNavigating={setIsNavigating} />
            <section
                id="home"
                className="min-h-screen flex items-center justify-center relative overflow-hidden mt-5"
            >
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                    <div
                        className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
                        style={{ animationDelay: '2s' }}
                    ></div>
                    <div
                        className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
                        style={{ animationDelay: '4s' }}
                    ></div>
                </div>

                <div className="text-center z-10 animate-fade-in">
                    <div className="mb-4">
                        <p className="text-lg md:text-xl text-violet-400 font-medium">Hello, I'm</p>
                        <h1 className="text-5xl md:text-7xl font-bold mb-2">
                            <span className="gradient-text">John Kristan Torremocha</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
                            Software Engineer
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl mb-8 text-gray-300 typing-animation max-w-2xl mx-auto">
                        Passionate software engineer crafting innovative web solutions with 1+
                        year of web development experience and a portfolio of personal projects
                    </p>

                    <div className="space-x-4">
                        <button
                            onClick={(e) => handleNavClick(e, '/projects', setIsNavigating)}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 rounded-full font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 animate-glow"
                        >
                            View My Work
                        </button>
                        <button
                            onClick={(e) => handleNavClick(e, '/contact', setIsNavigating)}
                            className="border-2 border-violet-600 px-8 py-3 rounded-full font-semibold hover:bg-violet-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Get In Touch
                        </button>
                    </div>

                    <SocialMedia />
                </div>
            </section>

            <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-center mb-16 gradient-text animate-slide-up">
                        About Me
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="animate-slide-up">
                            <div className="w-100 h-100 mx-auto bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                                <img
                                    src="/img/johnkristan-photo.jpg"
                                    alt="John Kristan Image"
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 animate-slide-up">
                            <h3 className="text-3xl font-bold text-violet-400">
                                Passionate Problem Solver
                            </h3>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                I've developed expertise spanning both frontend and backend
                                technologies, bringing ideas to life through clean, efficient code
                                and intuitive user experiences. My journey in software development
                                began with curiosity and has grown through hands-on experience
                                building real-world applications. With a year of web development
                                experience under my belt, I've learned to tackle challenges head-on
                                and deliver solutions that make a meaningful impact.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                My journey in software development has equipped me with a diverse
                                skill set, allowing me to tackle complex challenges and deliver
                                scalable applications that make a real impact.
                            </p>
                            <div className="flex space-x-4 pt-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-violet-400">1+</div>
                                    <div className="text-sm text-gray-400">Year Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="skills" className="py-20 bg-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
                        Technical Expertise
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="glass-effect p-8 rounded-2xl tech-card">
                            <div className="text-4xl mb-4">⚛️</div>
                            <h3 className="text-2xl font-bold mb-4 text-violet-400">Frontend</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-9">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <span>JavaScript ES6+</span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        <span>Vue</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <span>Next.js</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                                    <span>React</span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-effect p-8 rounded-2xl tech-card">
                            <div className="text-4xl mb-4">🔧</div>
                            <h3 className="text-2xl font-bold mb-4 text-violet-400">Backend</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <span>Python</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <span>PHP</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <span>Laravel</span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-effect p-8 rounded-2xl tech-card">
                            <div className="text-4xl mb-4">🗄️</div>
                            <h3 className="text-2xl font-bold mb-4 text-violet-400">Database</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <span>PostgreSQL</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                    <span>MySQL</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Redis</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-effect p-8 rounded-2xl tech-card md:col-span-2 lg:col-span-3 ">
                            <div className="text-center">
                                <div className="text-4xl mb-4">⚙️</div>
                                <h3 className="text-2xl font-bold mb-4 text-violet-400">
                                    Cloud & DevOps
                                </h3>
                                <div className="flex justify-center mb-6">
                                    <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-3 rounded-full">
                                        <img
                                            src="/img/aws-icon.png"
                                            alt="AWS"
                                            className="w-6 h-6"
                                        />
                                        <span className="font-semibold text-black">
                                            Amazon Web Services (AWS)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3 mt-4">
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img
                                            src="/img/ec2-icon.jpg"
                                            alt="EC2"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-300">EC2</span>
                                    </div>
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img
                                            src="/img/rds-icon.png"
                                            alt="RDS"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-300">RDS</span>
                                    </div>
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img src="/img/s3-icon.png" alt="S3" className="w-4 h-4" />
                                        <span className="text-sm text-gray-300">S3</span>
                                    </div>
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img
                                            src="/img/terraform-icon.png"
                                            alt="Terraform"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-300">Terraform</span>
                                    </div>
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img
                                            src="/img/docker-icon.png"
                                            alt="Docker"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-300">Docker</span>
                                    </div>
                                    <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2">
                                        <img
                                            src="/img/github-actions.png"
                                            alt="GitHub Actions"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-300">
                                            GitHub Actions
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Projects />

            <ContactSection />

            <footer className="py-8 bg-gray-900 text-center">
                <p className="text-gray-400">
                    &copy; 2025 John Kristan F. Torremocha. Crafted with 💜 and lots of ☕
                </p>
            </footer>
            <ChatWidget />
        </>
    )
}
