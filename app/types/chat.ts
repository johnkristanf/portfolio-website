export interface ChatMessage {
    role?: 'system' | 'user' | 'assistant' | 'tool'
    content?: string
    call_id?: string
    type?: string
    output?: string
}

export interface Tool {
    type: 'function'
    name: string
    description?: string
    parameters: {
        type: 'object'
        properties: Record<string, any>
        required?: string[]
    }
}

export interface ChatOptions {
    model?: string
    temperature?: number
    tools?: Tool[]
    previousResponseId?: string
}

export interface FunctionCall {
    id?: string
    name: string
    arguments: string
}

export interface ChatResponse {
    content: string | null
    functionCalls?: FunctionCall[]
    responseId?: string
    usage?: {
        input_tokens: number
        output_tokens: number
        total_tokens: number
    }
}
