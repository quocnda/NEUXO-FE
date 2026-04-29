import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import PreviewEmail from '@/components/automate-email/PreviewEmail';
import Sequence from '@/components/automate-email/Sequence';
import Tag from '@/components/TagComponent';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { HStack, Show } from '@/components/ui/Utilities';
import type { FCC } from '@/types';

interface IModalAutomateEmailProps {
  listEmailAction: any[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  event_id?: string;
  source?: string;
}
interface FormValues {
  sequence: { day: number }[];
  bimonthly_follow_up: boolean;
  hot_trigger_prompt: boolean;
}

const ModalAutomateEmail: FCC<IModalAutomateEmailProps> = ({
  children,
  listEmailAction,
  isOpen,
  setIsOpen,
  event_id,
  source,
}) => {
  const [step, setStep] = useState(0);
  const [valueSignature, setValueSignature] = useState<{ id: string; signature_name: string }>({
    id: '',
    signature_name: '',
  });
  const [sequenceId, setSequenceId] = useState(null);
  const form = useForm<FormValues>({
    defaultValues: {
      sequence: [],
      bimonthly_follow_up: true,
      hot_trigger_prompt: true,
    },
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setValueSignature({
      id: '',
      signature_name: '',
    });
    form.reset();
    setStep(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-screen-lg gap-0 overflow-auto rounded-t-md bg-white p-0">
        <DialogHeader classNameHeader="bg-main px-4 py-3 max-h-[63px] rounded-t-md sticky top-0 z-50">
          <Tag className="bg-neutral-0">
            <HStack spacing={4} noWrap className="text-lg font-semibold text-white">
              <span>Automate Email</span>
            </HStack>
          </Tag>
        </DialogHeader>
        <Show when={step === 0}>
          <Sequence
            form={form}
            isOpen={isOpen}
            setStep={setStep}
            listEmailAction={listEmailAction}
            setSequenceId={setSequenceId}
            setValueSignature={setValueSignature}
            valueSignature={valueSignature}
            source={source}
          />
        </Show>
        <Show when={step === 1}>
          <PreviewEmail
            setStep={setStep}
            listEmailAction={listEmailAction}
            setSequenceId={setSequenceId}
            sequenceId={sequenceId}
            handleToggle={handleToggle}
            source={source}
            event_id={event_id}
          />
        </Show>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAutomateEmail;
