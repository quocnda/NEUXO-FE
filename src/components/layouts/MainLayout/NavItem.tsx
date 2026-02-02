import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { memo, useEffect, useRef, useState } from 'react';

import { type Icon } from '@/assets/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui/tooltip';
import { Show } from '@/components/ui/Utilities';
import { useMobile } from '@/hooks/breakpoint';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores';

interface NavChildItem {
  key: string;
  title: string;
  route: string;
}

interface NavItemProps {
  Icon?: Icon;
  className?: string;
  title: string;
  onlyIcon?: boolean;
  active?: boolean;
  link?: string;
  childrenItems?: NavChildItem[];
}

// === Subcomponents ===

const NavLinkContent = ({ Icon, title, onlyIcon, active, hasChildren, open }: any) => (
  <>
    {Icon && (
      <Tooltip label={<p className="text-xs font-normal">{title}</p>} hidden={!onlyIcon}>
        <span>
          <Icon
            width={18}
            height={18}
            color="currentColor"
            className={cn('transition-color group-hover:text-main text-[#6F767E]', {
              'text-main': active,
            })}
          />
        </span>
      </Tooltip>
    )}
    {!onlyIcon && (
      <>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className={cn(
            'transition-color group-hover:text-main ml-3 whitespace-nowrap text-sm font-medium text-neutral-50',
            {
              'text-main': active,
            }
          )}
        >
          {title}
        </motion.span>
        {hasChildren && (
          <span className="group-hover:text-main ml-1 text-neutral-50">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </>
    )}
  </>
);

const SidebarChildLinks = ({ childrenItems, pathname, isMobile, toggleSidebar }: any) => (
  <motion.div
    initial={{ height: 0 }}
    animate={{ height: 'auto' }}
    className="ml-6 mt-1 flex flex-col gap-1 overflow-hidden"
  >
    {childrenItems.map((child: NavChildItem) => (
      <Link
        key={child.key}
        href={child.route}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          'text-neutral-60 hover:bg-neutral-30 hover:text-main ml-[10px] rounded-l-md rounded-r-2xl px-4 py-2 text-sm',
          {
            'bg-neutral-30 text-main': child.route === pathname,
          }
        )}
      >
        {child.title}
      </Link>
    ))}
  </motion.div>
);

const DropdownChildren = ({ childrenItems, pathname, isMobile, toggleSidebar }: any) => (
  <DropdownMenuContent
    className="z-[9999] ml-1 flex max-h-[200px] w-fit flex-col gap-1 overflow-auto border-none bg-transparent shadow-none"
    side="right"
  >
    {childrenItems.map((child: NavChildItem) => (
      <Link
        key={child.key}
        href={child.route}
        onClick={() => {
          toggleSidebar?.();
        }}
        className={cn(
          'text-neutral-80 hover:bg-neutral-30 hover:text-main block rounded-md bg-white px-4 py-2 text-sm shadow-lg',
          {
            'bg-neutral-30 text-main': child.route === pathname,
          }
        )}
      >
        {child.title}
      </Link>
    ))}
  </DropdownMenuContent>
);

// === Main NavItem Component ===

const NavItem = ({ Icon, active, link = '', title, onlyIcon, className, childrenItems = [] }: NavItemProps) => {
  const { toggleSidebar, fullSidebar } = useLayoutStore();
  const isMobile = useMobile();
  const pathname = usePathname();

  const [open, setOpen] = useState(() => childrenItems.some((child) => child.route === pathname));
  const hasChildren = childrenItems.length > 0;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (!fullSidebar && hasChildren && dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, fullSidebar, hasChildren]);

  const handleClick = () => {
    if (hasChildren) {
      if (fullSidebar) {
        setOpen((prev) => !prev);
      } else {
        setDropdownOpen((prev) => !prev);
      }
    } else if (isMobile) {
      toggleSidebar();
    }
  };

  const linkClasses = cn(
    'group flex h-12 w-full items-center rounded-l-md rounded-r-2xl px-4 py-2 text-main hover:bg-neutral-30',
    {
      'bg-neutral-30': active,
      'justify-center': onlyIcon,
      'cursor-pointer': hasChildren,
    },
    className
  );

  return (
    <div className="relative">
      {hasChildren ? (
        <Show when={!fullSidebar}>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <div className={linkClasses} onClick={handleClick}>
                <NavLinkContent
                  Icon={Icon}
                  title={title}
                  onlyIcon={onlyIcon}
                  active={active}
                  hasChildren={hasChildren}
                  open={open}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownChildren
              childrenItems={childrenItems}
              pathname={pathname}
              isMobile={isMobile}
              toggleSidebar={isMobile ? toggleSidebar : undefined}
            />
          </DropdownMenu>
        </Show>
      ) : null}
      {hasChildren ? (
        <Show when={fullSidebar}>
          <>
            <div className={linkClasses} onClick={handleClick}>
              <NavLinkContent
                Icon={Icon}
                title={title}
                onlyIcon={onlyIcon}
                active={active}
                hasChildren={hasChildren}
                open={open}
              />
            </div>

            <Show when={open}>
              <span className="absolute bottom-2 left-[24px] top-12 z-0 w-px bg-[#D4D7DD]" />
              {childrenItems.map((child, index) =>
                child.route === pathname ? (
                  <span
                    key="highlight-line"
                    className="absolute left-[24px] z-10 w-px bg-blue-500"
                    style={{
                      top: `calc(3rem + ${index * 2.5}rem)`,
                      height: '2.5rem',
                    }}
                  />
                ) : null
              )}
              <SidebarChildLinks
                childrenItems={childrenItems}
                pathname={pathname}
                isMobile={isMobile}
                toggleSidebar={toggleSidebar}
              />
            </Show>
          </>
        </Show>
      ) : null}
      {!hasChildren && (
        <Link href={link} className={linkClasses} onClick={() => isMobile && toggleSidebar()}>
          <NavLinkContent Icon={Icon} title={title} onlyIcon={onlyIcon} active={active} />
        </Link>
      )}
    </div>
  );
};

export default memo(NavItem);
