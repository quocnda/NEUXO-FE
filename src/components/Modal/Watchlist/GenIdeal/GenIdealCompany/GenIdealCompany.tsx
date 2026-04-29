import { ArchiveRestore } from 'lucide-react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import { getIdChatCompany, useListHistoryChat } from '@/api/watchlist';
import { Icons } from '@/assets/icons';
import { Tooltip } from '@/components/ui/tooltip';
import Base3 from '@/components/ui/typography/base3';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';

import BoxChatCompany from './GenIdeal';
import History from './History';

const GenIdealCompany = ({ isOpen }: { isOpen: boolean }) => {
  const [loadingText, setLoadingText] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [completionsId, setCompletionsId] = useState<string | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const { data: listHistoryChat, refetch: refetchListHistory } = useListHistoryChat({
    variables: { id: String(id) },
    enabled: isOpen,
  });

  const toggleEdit = (completions_id: string) => {
    setIsEdit((prev) => (prev === completions_id ? null : completions_id));
  };

  const handleNews = async () => {
    const response = await getIdChatCompany(String(id));

    setCompletionsId(response?.data);
    setMessages([]);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTo({
          top: messagesEndRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  return (
    <HStack noWrap className="h-full" align={'start'} spacing={0}>
      <VStack spacing={8} className="w-full">
        <HStack pos={'apart'}>
          <Base3>AI-generated pitch ideas</Base3>
          <HStack spacing={4}>
            <Tooltip label="New chat">
              <div
                className={cn(
                  'bg-main-green cursor-pointer rounded-full p-2',
                  isFetching && 'cursor-not-allowed bg-gray-300'
                )}
                onClick={() => {
                  if (!isFetching) {
                    handleNews();
                  }
                }}
              >
                <Icons.newChat width={15} height={15} color="white" />
              </div>
            </Tooltip>
            <Tooltip label="History">
              <div
                className={cn('bg-neutral-40 cursor-pointer rounded-full p-2 text-white')}
                onClick={() => {
                  setSidebarOpen(!isSidebarOpen);
                }}
              >
                <ArchiveRestore size={14} />
              </div>
            </Tooltip>
          </HStack>
        </HStack>
        <BoxChatCompany
          completionsId={completionsId}
          setCompletionsId={setCompletionsId}
          setLoadingText={setLoadingText}
          loadingText={loadingText}
          messages={messages}
          setMessages={setMessages}
          typingMessage={typingMessage}
          setTypingMessage={setTypingMessage}
          refetchListHistory={refetchListHistory}
          typingIntervalRef={typingIntervalRef}
          messagesEndRef={messagesEndRef}
          scrollToBottom={scrollToBottom}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          handleNews={handleNews}
        />
      </VStack>
      <History
        isSidebarOpen={isSidebarOpen}
        listHistoryChat={listHistoryChat}
        isEdit={isEdit}
        toggleEdit={toggleEdit}
        refetchListHistory={refetchListHistory}
        setMessages={setMessages}
        setCompletionsId={setCompletionsId}
        completionsId={completionsId}
        handleNews={handleNews}
        onClick={() => {
          setTimeout(() => {
            scrollToBottom();
          }, 0);
        }}
      />
    </HStack>
  );
};

export default GenIdealCompany;
