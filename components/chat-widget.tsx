'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Bot, X, Send, User, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

type Message = {
    role: 'user' | 'assistant'
    content: string
}

type ChatFormData = {
    message: string
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid },
    } = useForm<ChatFormData>()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const onSubmit = async (data: ChatFormData) => {
        const userMessage = data.message.trim()
        if (!userMessage) return

        // Add user message immediately
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
        reset()
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch response')
            }

            const responseData = await response.json()

            // Add assistant message
            if (responseData.content) {
                setMessages((prev) => [...prev, { role: 'assistant', content: responseData.content }])
            } else if (responseData.error) {
                setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${responseData.error}` }])
            }

        } catch (error) {
            console.error('Chat error:', error)
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110",
                    isOpen
                        ? "bg-gray-700 text-white rotate-90"
                        : "bg-gradient-to-r from-violet-600 to-purple-600 text-white animate-bounce-subtle"
                )}
                style={{ animationDuration: '3s' }}
                aria-label="Toggle chat"
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-900 to-purple-900 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">John's Github AI Assistant</h3>
                                <p className="text-xs text-gray-300">Ask me anything about John's Github profiles, repositories, and projects, etc...</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
                                <div className="text-center space-y-2">
                                    <Bot size={48} className="mx-auto text-violet-500 opacity-20" />
                                    <p className="text-sm text-gray-400">Ask me anything about John's work!</p>
                                </div>
                                <div className="grid gap-2 w-full px-4">
                                    {[
                                        "What are johnkristanf's most popular repositories?",
                                        "What technologies does johnkristanf use?",
                                        "Tell me about johnkristanf's recent projects.",
                                    ].map((question) => (
                                        <button
                                            key={question}
                                            onClick={() => onSubmit({ message: question })}
                                            className="text-left p-3 text-xs bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-gray-300 transition-all hover:border-violet-500/50"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                    msg.role === 'user' ? "bg-violet-600" : "bg-gray-700"
                                )}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div
                                    className={cn(
                                        "p-3 rounded-2xl text-sm",
                                        msg.role === 'user'
                                            ? "bg-violet-600 text-white rounded-tr-none"
                                            : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                                    )}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({ node, ...props }) => (
                                                <a
                                                    {...props}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white/80 transition-all"
                                                />
                                            ),
                                            p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0 leading-relaxed" />,
                                            ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-2" />,
                                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-2" />,
                                            li: ({ node, ...props }) => <li {...props} className="mb-1" />,
                                            strong: ({ node, ...props }) => <strong {...props} className="font-bold text-violet-200" />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                                    <Loader2 size={16} className="animate-spin text-violet-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2"
                    >
                        <input
                            {...register('message', { required: true })}
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700 placeholder-gray-500"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
