import OpenAI from 'openai'
import { ChatMessage, ChatOptions, ChatResponse, FunctionCall, Tool } from '../types/chat'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export class ChatService {
    /**
     * Calls OpenAI LLM using the Responses API
     */
    static async callLLM(input: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
        const { model, temperature, tools, previousResponseId } = options

        const params: any = {
            model,
            input,
            temperature,
        }

        if (tools) {
            params.tools = tools
        }

        if (previousResponseId) {
            params.previous_response_id = previousResponseId
        }

        console.log('params: ', JSON.stringify(params, null, 2))

        const response = await openai.responses.create(params)

        console.log('response: ', JSON.stringify(response, null, 2))

        const functionCalls: FunctionCall[] = []
        let content: string | null = null

        // Process output array
        response.output?.forEach((item: any) => {
            if (item.type === 'function_call') {
                functionCalls.push({
                    id: item.call_id,
                    name: item.name,
                    arguments: item.arguments,
                })
            } else if (item.type === 'text' || item.type === 'message') {
                content = item.content[0].text || item.text || null
            }
        })

        const usage = response.usage
            ? {
                  input_tokens: (response.usage as any).input_tokens || 0,
                  output_tokens: (response.usage as any).output_tokens || 0,
                  total_tokens: (response.usage as any).total_tokens || 0,
              }
            : undefined

        return {
            content,
            usage,
            functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
            responseId: response.id,
        }
    }

    /**
     * Convenience method for a simple user message
     */
    static async sendMessage(
        userMessage: string,
        systemPrompt?: string,
        options?: ChatOptions,
        toolsCallMap?: Map<string, (args: any) => Promise<any> | any>,
    ): Promise<ChatResponse> {
        const input: ChatMessage[] = []
        if (systemPrompt) {
            input.push({ role: 'system', content: systemPrompt })
        }

        input.push({ role: 'user', content: userMessage })

        // Run normal call if no tools, otherwise use callLLMWithFunctions
        if (!options?.tools || options.tools.length === 0) {
            return this.callLLM(input, options)
        } else {
            return this.callLLMWithFunctions(input, toolsCallMap!, options)
        }
    }

    /**
     * Calls the LLM with function calling support and handles function execution
     */
    static async callLLMWithFunctions(
        input: ChatMessage[],
        toolsCallMap: Map<string, (args: any) => Promise<any> | any>,
        options: ChatOptions,
        maxIterations: number = 5,
    ): Promise<ChatResponse> {
        let currentInput = [...input]
        let previousResponseId = options.previousResponseId
        let iterations = 0

        while (iterations < maxIterations) {
            const response = await this.callLLM(currentInput, {
                ...options,
                previousResponseId,
            })

            if (!response.functionCalls || response.functionCalls.length === 0) {
                return response
            }

            console.log('response.functionCalls: ', JSON.stringify(response.functionCalls, null, 2))

            previousResponseId = response.responseId

            // Execute function calls and add results to input
            for (const functionCall of response.functionCalls) {
                const functionResult = await this.executeFunctionCall(functionCall, toolsCallMap)

                // Add function result to input
                currentInput.push({
                    type: 'function_call_output',
                    output: JSON.stringify(functionResult),
                    call_id: functionCall.id,
                })
            }

            iterations++
        }

        return await this.callLLM(currentInput, { ...options, previousResponseId })
    }

    static async executeFunctionCall(
        functionCall: FunctionCall,
        toolsCallMap: Map<string, (args: any) => Promise<any> | any>,
    ): Promise<any> {
        const func = toolsCallMap.get(functionCall.name)
        if (!func) {
            throw new Error(`Function ${functionCall.name} not found`)
        }

        let functionResult: any
        try {
            const args = JSON.parse(functionCall.arguments)
            const result = func(args)
            functionResult = result instanceof Promise ? await result : result
        } catch (error) {
            functionResult = {
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }

        return functionResult
    }
}
