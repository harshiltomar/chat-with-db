'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Chat with Database</h1>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[calc(100vh-200px)] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Welcome to Chat with Database</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Start a conversation by asking questions about your database. I can help you query data, explore schemas, and more.
                </p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  }`}>
                    {/* <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        message.role === 'user' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {message.role === 'user' ? 'U' : 'AI'}
                      </div>
                      <span className="text-sm font-medium opacity-80">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div> */}
                    <div className="space-y-2">
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <div key={`${message.id}-${i}`} className="whitespace-pre-wrap leading-relaxed">
                                {part.text}
                              </div>
                            );
                          case 'tool-db':
                            return (
                              <div key={`${message.id}-${i}`} className="mt-3">
                                <div className="text-xs font-medium opacity-80 mb-2">Database Query Result:</div>
                                <pre className="bg-slate-900 dark:bg-slate-800 text-green-400 p-3 rounded-lg text-xs overflow-x-auto border border-slate-700">
                                  {JSON.stringify(part, null, 2)}
                                </pre>
                              </div>
                            );
                          case 'tool-schema':
                            return (
                              <div key={`${message.id}-${i}`} className="mt-3">
                                <div className="text-xs font-medium opacity-80 mb-2">Database Schema:</div>
                                <pre className="bg-slate-900 dark:bg-slate-800 text-blue-400 p-3 rounded-lg text-xs overflow-x-auto border border-slate-700">
                                  {JSON.stringify(part, null, 2)}
                                </pre>
                              </div>
                            );
                        }
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput('');
                }
              }}
              className="flex space-x-3"
            >
              <div className="flex-1 relative">
                <input
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  value={input}
                  placeholder="Ask about your database..."
                  onChange={e => setInput(e.currentTarget.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}