import { Check, Mail, Plus, X } from 'lucide-react';
import { useState } from 'react';

import type { IContactDetail } from '@/api/company';
import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HStack, Show } from '@/components/ui/Utilities';

type IconComponent = React.ComponentType<{ size: number; color: string }>;

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ContactEmail = ({
  item,
  onUpdate,
  onDelete,
  onAdd,
}: {
  item: IContactDetail;
  onUpdate?: (id_email: string, id_contact: string, email: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: (id: string, email: string) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const isValid = validateEmail(newEmail);

  const handleAdd = () => {
    if (onAdd && isValid) {
      onAdd(item.id, newEmail);
      setNewEmail('');
      setIsAdding(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-start justify-start gap-2">
      {Array.isArray(item?.emails) &&
        item.emails.map((emailItem) => (
          <LinkItem
            key={emailItem.id}
            id={emailItem.id}
            icon={Mail as IconComponent}
            link={emailItem.email}
            onUpdate={onUpdate}
            onDelete={onDelete}
            item={item}
          />
        ))}

      <Show when={isAdding}>
        <div className="flex items-center gap-2">
          <div className="flex flex-nowrap items-center gap-[10.82px]">
            <div className="flex h-5 w-5 items-center justify-center">
              <Mail size={16} color="gray" />
            </div>
            <Input
              variant={'outline'}
              value={newEmail}
              inputSize={'xs'}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
          </div>
          <HStack spacing={8} noWrap>
            <X size={14} color="red" className="cursor-pointer" onClick={() => setIsAdding(false)} />
            <Button disabled={!isValid} variant={'link'} className="p-0">
              <Check
                size={14}
                color={isValid ? 'green' : 'gray'}
                className={`cursor-pointer ${isValid ? '' : 'cursor-not-allowed'}`}
                onClick={handleAdd}
              />
            </Button>
          </HStack>
        </div>
      </Show>
      <Show when={!isAdding}>
        <div className="border-neutral-40 absolute right-0 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border hover:opacity-50">
          <Plus size={14} color="#6B7280" className="cursor-pointer" onClick={() => setIsAdding(true)} />
        </div>
      </Show>
    </div>
  );
};

const LinkItem = ({
  id,
  icon: Icon,
  link,
  onUpdate,
  onDelete,
  item,
}: {
  id: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  link?: string | null;
  onUpdate?: (id_email: string, id_contact: string, email: string) => void;
  onDelete?: (id: string) => void;
  item: IContactDetail;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [tempLink, setTempLink] = useState<string>(link || '');

  const isValid = validateEmail(tempLink);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    if (!isEdit) {
      setTempLink(link || '');
    }
  };

  const handleSave = () => {
    if (onUpdate && isValid) {
      onUpdate(id, item.id, tempLink);
    }
    setIsEdit(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="flex w-full flex-nowrap items-center gap-[10.82px]">
      <div className="flex h-5 w-5 items-center justify-center">
        <Icon size={16} color="gray" />
      </div>
      {isEdit ? (
        <div className="group flex items-center gap-2">
          <Input
            variant={'outline'}
            value={tempLink}
            inputSize={'xs'}
            onChange={(e) => setTempLink(e.target.value)}
            className={`${isValid ? 'border-gray-300' : 'border-red-500'}`}
          />
          <HStack spacing={8}>
            <X size={14} color="red" className="cursor-pointer" onClick={toggleEdit} />
            <Button disabled={!isValid} variant={'link'} className="p-0">
              <Check
                size={14}
                color={isValid ? 'green' : 'gray'}
                className={`cursor-pointer ${isValid ? '' : 'cursor-not-allowed'}`}
                onClick={handleSave}
              />
            </Button>
          </HStack>
        </div>
      ) : (
        <div className="group flex items-center gap-2">
          <p className="text-neutral-40 truncate text-sm">{link?.replace(/^https?:\/\/(www\.)?/, '') || '-'}</p>
          <div className="hidden gap-2 group-hover:flex">
            <Icons.edit width={14} height={14} color="green" className="cursor-pointer" onClick={toggleEdit} />
            <Icons.remove width={14} height={14} color="red" className="cursor-pointer" onClick={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactEmail;
