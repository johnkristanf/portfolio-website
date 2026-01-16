import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Dispatch, SetStateAction } from 'react'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const handleNavClick = (
    e: any,
    href: string,
    setIsNavigating: Dispatch<SetStateAction<boolean>>,
) => {
    e.preventDefault()
    setIsNavigating(true)

    // Then scroll to the section
    setTimeout(() => {
        const sectionId = href === '/' ? 'home' : href.slice(1)
        const section = document.getElementById(sectionId)
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
        setTimeout(() => setIsNavigating(false), 1000)
    }, 100)
}