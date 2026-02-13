import OpenAI from 'openai'
import { ChatMessage, ChatOptions, ChatResponse, FunctionCall, Tool } from '../types/chat'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


export class ChatService {
  /**
   * Calls OpenAI LLM using the Responses API
   */
  static async callLLM(
    input: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 1000,
      tools,
      previousResponseId,
    } = options

    const params: any = {
      model,
      input,
      temperature,
      max_tokens: maxTokens,
    }

    if (tools) {
      params.tools = tools
    }

    if (previousResponseId) {
      params.previous_response_id = previousResponseId
    }

    const response = await openai.responses.create(params)

    const functionCalls: FunctionCall[] = []
    let content: string | null = null

    // Process output array
    response.output?.forEach((item: any) => {
      if (item.type === 'function_call') {
        functionCalls.push({
          name: item.name,
          arguments: item.arguments,
        })
      } else if (item.type === 'text') {
        content = item.text || null
      }
    })

    return {
      content,
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
      responseId: response.id,
      usage: response.usage
        ? {
            promptTokens: (response.usage as any).prompt_tokens || 0,
            completionTokens: (response.usage as any).completion_tokens || 0,
            totalTokens: (response.usage as any).total_tokens || 0,
          }
        : undefined,
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
    options: ChatOptions = {},
    maxIterations: number = 5
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

      previousResponseId = response.responseId

      // Execute function calls and add results to input
      for (const functionCall of response.functionCalls) {
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

        // Add function result to input
        currentInput.push({
          role: 'tool',
          content: JSON.stringify(functionResult),
        })
      }

      iterations++
    }

    return await this.callLLM(currentInput, { ...options, previousResponseId })
  }
}

/*
 * SAMPLE USAGE:
 *
 * // 1. Simple message without functions
 * const response = await ChatService.sendMessage(
 *   "What is the capital of France?",
 *   "You are a helpful assistant."
 * )
 * console.log(response.content)
 *
 * // 2. Using callLLM directly with message array
 * const messages: ChatMessage[] = [
 *   { role: 'system', content: 'You are a helpful assistant.' },
 *   { role: 'user', content: 'What is 2+2?' }
 * ]
 * const response = await ChatService.callLLM(messages, {
 *   model: 'gpt-4o-mini',
 *   temperature: 0.7
 * })
 *
 * // 3. Multi-turn conversation
 * const firstResponse = await ChatService.callLLM([
 *   { role: 'user', content: 'Hello!' }
 * ])
 * const secondResponse = await ChatService.callLLM([
 *   { role: 'user', content: 'What did I just say?' }
 * ], {
 *   previousResponseId: firstResponse.responseId
 * })
 *
 * // 4. With function calling
 * const tools: Tool[] = [
 *   {
 *     type: 'function',
 *     name: 'get_weather',
 *     description: 'Get the current weather for a location',
 *     parameters: {
 *       type: 'object',
 *       properties: {
 *         location: {
 *           type: 'string',
 *           description: 'The city and state, e.g. San Francisco, CA'
 *         }
 *       },
 *       required: ['location']
 *     }
 *   }
 * ]
 *
 * const functionImplementations = new Map([
 *   ['get_weather', async (args: { location: string }) => {
 *     // Your weather API call here
 *     return { temperature: 72, condition: 'sunny' }
 *   }]
 * ])
 *
 * const response = await ChatService.callLLMWithFunctions(
 *   [{ role: 'user', content: 'What is the weather in San Francisco?' }],
 *   tools,
 *   functionImplementations
 * )
 *
 * // 5. Example from OpenAI docs (horoscope)
 * const horoscopeTools: Tool[] = [
 *   {
 *     type: 'function',
 *     name: 'get_horoscope',
 *     description: "Get today's horoscope for an astrological sign.",
 *     parameters: {
 *       type: 'object',
 *       properties: {
 *         sign: {
 *           type: 'string',
 *           description: 'An astrological sign like Taurus or Aquarius'
 *         }
 *       },
 *       required: ['sign']
 *     }
 *   }
 * ]
 *
 * function getHoroscope(sign: string) {
 *   return sign + " Next Tuesday you will befriend a baby otter."
 * }
 *
 * const horoscopeFunctions = new Map([
 *   ['get_horoscope', (args: { sign: string }) => getHoroscope(args.sign)]
 * ])
 *
 * const horoscopeResponse = await ChatService.callLLMWithFunctions(
 *   [{ role: 'user', content: 'What is my horoscope? I am an Aquarius.' }],
 *   horoscopeTools,
 *   horoscopeFunctions
 * )
 */
