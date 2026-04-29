/* eslint-disable no-lonely-if */
import axios from 'axios';
import { ArrowUpIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { genIdealCompany } from '@/api/watchlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Show } from '@/components/ui/Utilities';
import { env } from '@/lib/const';
import { formatMessageContent } from '@/lib/formatText';
import { useUserStore } from '@/stores';

import Empty from '../../../../Empty';

interface Props {
  setLoadingText: (value: boolean) => void;
  loadingText: boolean;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  typingMessage: string;
  setTypingMessage: React.Dispatch<React.SetStateAction<string>>;
  completionsId: string | null;
  setCompletionsId: React.Dispatch<React.SetStateAction<string | null>>;
  refetchListHistory?: () => void;
  typingIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  handleNews: () => Promise<void>;
}

const BoxChatCompany = (props: Props) => {
  const {
    setLoadingText,
    loadingText,
    messages,
    setMessages,
    typingMessage,
    setTypingMessage,
    completionsId,
    setCompletionsId,
    refetchListHistory,
    typingIntervalRef,
    messagesEndRef,
    scrollToBottom,
    isFetching,
    setIsFetching,
    handleNews,
  } = props;
  const rowRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { access_token } = useUserStore();

  useEffect(() => {
    setCompletionsId(null);
    setMessages([]);
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const response = await genIdealCompany(String(id));
        setMessages([
          {
            role: 'user',
            content: response?.prompt,
          },
          {
            role: 'assistant',
            content: response?.content,
          },
        ]);
        refetchListHistory?.();
        setCompletionsId(response?.completions_id);
      } catch (error: any) {
        toast.error(error?.message || 'Error fetching data');
        await handleNews();
      } finally {
        setIsFetching(false);
        scrollToBottom();
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (newMessages: any[]) => {
    try {
      setLoading(true);
      setTypingMessage('');
      const response = await axios.post(
        `${env.API_URL}/data/company/send-message-company`,
        {
          completion_id: completionsId,
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const botMessage = response.data.content;
      refetchListHistory?.();
      simulateTypingEffect(botMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const isAtBottom = () => {
    if (messagesEndRef.current) {
      return (
        messagesEndRef.current.scrollHeight - messagesEndRef.current.scrollTop <=
        messagesEndRef.current.clientHeight + 10
      );
    }
    return false;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    scrollToBottom();
    setInput('');
    await sendMessage(input);
  };

  const simulateTypingEffect = (text: string) => {
    let currentText = '';
    setTypingMessage('');
    setLoadingText(true);
    const parts = text.split(/(```[\s\S]*?```)/g);
    let currentPartIndex = 0;
    let currentCharIndex = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (currentPartIndex >= parts.length) {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: text }]);
        setTypingMessage('');
        setLoadingText(false);
        return;
      }

      const currentPart = parts[currentPartIndex];
      if (currentPart.startsWith('```')) {
        currentText += currentPart;
        currentPartIndex++;
      } else {
        if (currentCharIndex < currentPart.length) {
          currentText += currentPart[currentCharIndex];
          currentCharIndex++;
        } else {
          currentCharIndex = 0;
          currentPartIndex++;
        }
      }

      setTypingMessage(currentText);

      if (isAtBottom()) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToBottom();
          }, 0);
        });
      }
    }, 10);
  };

  useEffect(() => {
    return () => {
      // Clear typing interval when component unmounts
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rowRef} className="mb-4">
      <div className="mx-auto py-2">
        <Show when={!isFetching}>
          <div
            className="mb-4 max-h-[350px] overflow-y-auto rounded-lg border-2 border-[#9A9FA540] bg-white p-2"
            ref={messagesEndRef}
          >
            {messages.map((msg, index) => (
              <>
                <div
                  key={index}
                  className={`mb-2 flex text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded p-2 ${
                      msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    } max-w-md`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {formatMessageContent(msg.content)}
                  </div>
                </div>
              </>
            ))}

            {typingMessage && (
              <div className="mb-2 flex justify-start text-sm">
                <div className="max-w-md rounded bg-gray-200 p-2 text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                  {formatMessageContent(typingMessage)}
                </div>
              </div>
            )}
            {messages.length === 0 && <Empty content="No messages yet." />}
            {loading && (
              <SkeletonWrapper loading className="h-10 w-[200px]">
                <div className="mb-2 flex max-w-md justify-start rounded bg-gray-200 p-2 text-gray-800"></div>
              </SkeletonWrapper>
            )}
          </div>
        </Show>
        <Show when={isFetching}>
          <div className="mb-4 h-[250px] overflow-y-auto rounded-lg border-2 border-[#9A9FA540] bg-white p-2">
            <div className="flex h-full items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          </div>
        </Show>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            type="text"
            value={input}
            variant={'outline'}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="h-10 w-full rounded border border-gray-300 p-2 pr-14 text-sm"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1 h-8 w-8 rounded-full p-0 text-xs"
            disabled={loading || loadingText || isFetching}
          >
            <ArrowUpIcon size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BoxChatCompany;
