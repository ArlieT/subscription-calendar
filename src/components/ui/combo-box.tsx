import {
  Calculator,
  Calendar,
  CreditCard,
  icons,
  Settings,
  Smile,
  User,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

type Items = {
  name: string;
  heading: string;
  items: {
    name: string;
    icon: React.ReactNode;
  };
};

type CommandDemoProps = {
  className?: string;
  items: Items[];
};

const test = [
  {
    name: 'test',
    heading: 'test',
    items: [
      {
        name: 'test',
        icon: <Calendar className="mr-2 h-4 w-4" />,
      },
    ],
  },
];

export function CommandDemo({ className, items }: CommandDemoProps) {
  return (
    <Command className="rounded-lg border shadow-md ">
      <CommandInput placeholder="Type a command or search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {items?.map((item) => (
          <CommandGroup heading={item.heading}>
            <CommandItem>
              {item.items.icon}
              <span>{item.items.name}</span>
            </CommandItem>
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}
