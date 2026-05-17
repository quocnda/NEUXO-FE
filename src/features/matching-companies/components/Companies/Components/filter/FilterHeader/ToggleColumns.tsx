import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';

import { toggleColumnsAction } from '@/api/company';
import { Icons } from '@/assets/icons';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VStack } from '@/components/ui/Utilities';
import { formatItem } from '@/lib/common';
import { getMutateError } from '@/lib/getMutateError';
import { cn } from '@/lib/utils';

const DraggableColumns = ({ columns, onDragEnd, onToggle }: any) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="columns">
        {(provided: any) => (
          <VStack
            className="max-h-[calc(100vh-150px)] overflow-y-auto p-3"
            spacing={8}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Tag className="bg-secondary-green h-6 w-3" classNameContent="text-lg">
              Columns
            </Tag>
            {columns.map((item: any, index: number) => (
              <Draggable key={item.name} draggableId={item.name} index={index}>
                {(prov: any, snapshot: any) => {
                  return (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={cn(
                        'border-neutral-30 text-neutral-70 flex h-10 items-center justify-between rounded-md border-2 p-2 font-medium',
                        {
                          '!opacity-100': snapshot.isDragging,
                          '!bg-gray-200': snapshot.isDragging,
                          '!cursor-grabbing': snapshot.isDragging,
                        }
                      )}
                    >
                      <Label className="flex items-center gap-2 whitespace-nowrap text-[13px]">
                        <Input
                          type="checkbox"
                          onChange={() => onToggle(item)}
                          checked={item?.is_show}
                          className={cn('h-3 w-3', {
                            'cursor-no-drop': item.name === 'company',
                          })}
                        />
                        <span>{formatItem(item.name)}</span>
                      </Label>
                      <Icons.drag color="#6F767E" />
                    </div>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </VStack>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const ToggleColumns = ({ columns, refetch }: any) => {
  const [orderedColumns, setOrderedColumns] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sortedColumns = [...(columns || [])]
      .sort((a, b) => (a.order_by ?? 0) - (b.order_by ?? 0))
      .filter((item: any) => item.name !== 'company');

    setOrderedColumns(sortedColumns);
  }, [columns]);

  const { mutate } = useMutation(toggleColumnsAction, {
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      toast.error(getMutateError(err));
    },
  });

  const handleToggleColumns = (item: any) => {
    if (item.name === 'company') return;

    const updatedColumns = orderedColumns.map((col) =>
      col.name === item.name ? { ...col, is_show: !col.is_show } : col
    );

    const finalColumns = [
      {
        name: 'company',
        is_show: true,
      },
      ...updatedColumns,
    ];

    setOrderedColumns(updatedColumns);

    mutate({
      name_columns: finalColumns,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(orderedColumns);
    const [movedItem] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedItem);
    const columnsToSend = reorderedColumns.map((item) => ({
      ...item,
    }));
    const finalColumns = [
      {
        name: 'company',
        is_show: true,
      },
      ...columnsToSend,
    ];
    setOrderedColumns(reorderedColumns);
    mutate({
      name_columns: finalColumns,
    });
  };

  return (
    <div className="flex">
      <div className="relative inline-block">
        <Button variant="outline" className="flex h-8 items-center gap-2 px-4 py-2" onClick={() => setIsOpen(!isOpen)}>
          <Icons.column className="text-[#cccccc]" />
          <span className="text-xs font-medium">Columns</span>
        </Button>
        {isOpen && (
          <div className="absolute right-0 z-[999] mt-2 w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg">
            <DraggableColumns columns={orderedColumns} onDragEnd={handleDragEnd} onToggle={handleToggleColumns} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToggleColumns;
