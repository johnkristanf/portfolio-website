export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool'
    content: string
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
    maxTokens?: number
    tools?: Tool[]
    previousResponseId?: string
  }
  
  export interface FunctionCall {
    name: string
    arguments: string
  }
  
  export interface ChatResponse {
    content: string | null
    functionCalls?: FunctionCall[]
    responseId?: string
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }