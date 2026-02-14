import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

import { PostHogProvider } from './providers'

export const metadata: Metadata = {
    title: 'John Kristan.Dev',
    description: 'John Kristan Web Development Portfolio',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <title>John Kristan.Dev</title>
            <PostHogProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
                >
                    {children}

                    <Toaster position="top-right" />
                </body>
            </PostHogProvider>
        </html>
    )
}
