import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Logo from '@/components/Logo';
import LogoSmall from '@/components/LogoSmall';
import { HStack, Show } from '@/components/ui/Utilities';
import { useMobile } from '@/hooks/breakpoint';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';
import { ROUTE } from '@/types';

import { listSideBar } from './const';
import NavItem from './NavItem';

const SideBar = () => {
  const pathname = usePathname();
  const { fullSidebar, toggleSidebar } = useLayoutStore();
  const isMobile = useMobile();

  const initialOpenGroups = listSideBar.reduce((acc, group) => {
    acc[group.group] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    listSideBar.forEach((group) => {
      const found = group.items.find((item) => item.route === pathname);
      if (found) {
        setOpenGroups((prev) => ({ ...prev, [group.group]: true }));
      }
    });
  }, [pathname]);

  return (
    <div
      className={cn(
        {
          'w-full -translate-x-0 md:w-[13.9375rem]': fullSidebar,
          'w-[4.25rem] -translate-x-[100%] md:translate-x-0': !fullSidebar,
        },
        'fixed bottom-0 top-0 z-[1000] flex h-screen flex-col items-center justify-between border-r border-[#E6E8EC] bg-white/95 p-3 py-6 shadow-[0_8px_32px_rgba(16,24,40,0.08)] backdrop-blur transition-all duration-300 ease-linear'
      )}
    >
      <div className="flex w-full flex-col">
        <HStack pos={'apart'} noWrap className={cn('group', fullSidebar ? 'items-center' : 'flex flex-col')}>
          <div className="px-2">
            <Link className="mt-8" onClick={() => (isMobile ? toggleSidebar() : null)} href={ROUTE.HOME}>
              {fullSidebar ? <Logo /> : <LogoSmall />}
            </Link>
          </div>
          <button
            onClick={toggleSidebar}
            className={cn(
              'border-neutral-20 text-neutral-60 flex items-center rounded-md border bg-white p-1 shadow-sm transition hover:bg-neutral-10',
              !fullSidebar && 'hidden group-hover:block'
            )}
          >
            {!fullSidebar ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </HStack>
        <div
          className={cn(
            {
              'items-center': !fullSidebar,
            },
            'mt-8 flex max-h-[calc(100vh-180px)] flex-col gap-1 overflow-y-auto pr-1 transition-all'
          )}
        >
          {listSideBar.map((group) => (
            <div key={group.group} className="w-full">
              <Show when={fullSidebar}>
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="text-neutral-60 h-9 w-full rounded-md px-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-neutral-10"
                >
                  {group.group}
                </button>
              </Show>
              {(!fullSidebar || openGroups[group.group]) && (
                <div className="ml-1 flex flex-col gap-1">
                  {group.items.map((x) => (
                    <NavItem
                      key={x.key}
                      Icon={x.Icon}
                      onlyIcon={!fullSidebar}
                      title={x.title}
                      link={x?.route}
                      childrenItems={x.childrenItems}
                      active={pathname === x.route}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
