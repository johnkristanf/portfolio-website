import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@/app/services/chat'

import fs from 'fs'
import path from 'path'
import { ChatOptions, Tool } from '@/app/types/chat'
import { GithubService } from '@/app/services/github'

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Query string is required.' }, { status: 400 })
        }

        const promptPath = path.resolve(process.cwd(), 'app/prompts/github.md')
        const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

        const tools: Tool[] = [
            {
                type: 'function',
                name: 'get_github_profile',
                description: 'Get the authenticated user profile from GitHub.',
                parameters: {
                    type: 'object',
                    properties: {},
                },
            },

            {
                type: 'function',
                name: 'get_github_repos',
                description: 'Get the authenticated user profile from GitHub.',
                parameters: {
                    type: 'object',
                    properties: {},
                },
            },
        ]

        const toolsCallMap = new Map<string, (args: any) => Promise<any> | any>([
            ['get_github_profile', async (_args: any) => await GithubService.getProfile()],
            ['get_github_repos', async (_args: any) => await GithubService.getRepos()],
        ])

        const options: ChatOptions = {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            tools: tools,
        }

        const response = await ChatService.sendMessage(message, systemPrompt, options, toolsCallMap)
        return NextResponse.json(response)
    } catch (error: any) {
        console.error('Error in POST /api/chat:', error)
 
        // Handle standard HTTP errors if they exist on the error object
        const status = error?.status || 500
        const message = error?.message || 'Internal Server Error'

        return NextResponse.json({ error: message }, { status })
    }
}
