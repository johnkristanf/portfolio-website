'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const key = process.env.POSTHOG_KEY
        const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'

        if (key) {
            posthog.init(key, {
                api_host: host,
                person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
                capture_pageview: true // Disable automatic pageview capture, as we capture manually
            })
        }
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}
