import { ArchiveRestore } from 'lucide-react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useContactDetailCompany } from '@/api/company';
import { genIdealContact, getIdChatContact, useListHistoryChatContact } from '@/api/watchlist';
import { Icons } from '@/assets/icons';
import { SelectComp } from '@/components/ui/customize/select';
import { Tooltip } from '@/components/ui/tooltip';
import Base3 from '@/components/ui/typography/base3';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { tabNewsWatchList } from '@/features/watchlist-all/utils/const';

import BoxChatContact from './BoxChatContact';
import History from './History';

const GenIdealContact = ({ tab }: { tab: number | string }) => {
  const [loadingText, setLoadingText] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [completionsId, setCompletionsId] = useState<string | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [valueContact, setValueContact] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data: contactList } = useContactDetailCompany({
    variables: String(id),
    enabled: !!id,
  });

  const { data: listHistoryChat, refetch: refetchListHistory } = useListHistoryChatContact({
    variables: { id: String(valueContact) },
    enabled: tab === tabNewsWatchList[1].value && !!valueContact,
  });

  const toggleEdit = (completions_id: string) => {
    setIsEdit((prev) => (prev === completions_id ? null : completions_id));
  };

  const handleNews = async (contactId?: string) => {
    const response = await getIdChatContact(String(contactId || valueContact));

    setCompletionsId(response?.data);
    setMessages([]);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const handleGenIdealContact = async (option: any) => {
    setIsFetching(true);
    setValueContact(option.value);
    try {
      const response = await genIdealContact(String(option.value));
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
      await handleNews(option.value);
    } finally {
      setIsFetching(false);
      scrollToBottom();
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
        <VStack spacing={12}>
          <HStack pos={'apart'}>
            <Base3>Select Contact</Base3>
            <HStack spacing={4}>
              <Show when={!!valueContact}>
                <Tooltip label="New chat" className="z-[99999]">
                  <div className="bg-main-green cursor-pointer rounded-full p-2" onClick={() => handleNews()}>
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
                    <ArchiveRestore width={15} height={15} color="white" />
                  </div>
                </Tooltip>{' '}
              </Show>
            </HStack>
          </HStack>
          <SelectComp
            value={valueContact}
            onChangeValue={(option) => handleGenIdealContact(option)}
            data={(contactList || []).map((item) => ({ label: item?.name, value: item?.id }))}
            disabled={isFetching}
          />
        </VStack>
        <Base3>AI-generated pitch ideas</Base3>

        <BoxChatContact
          completionsId={completionsId}
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
          valueContact={valueContact}
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

export default GenIdealContact;
