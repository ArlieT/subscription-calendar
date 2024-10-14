'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import axios from 'axios';

import { cn, getRandomRgbColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@/lib/hooks/useDebounce';
import { LogoApiResponse } from 'src/types';
import { BRAND_LOGOS } from '@/lib/constants';
import { Avatar } from './avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getInitials } from '../Avatar';

export const retrieveBrandDataFromBrandDev = async (domain: string) => {
  const url = 'https://api.brand.dev/v1/brand/retrieve';
  const API_KEY = process.env.NEXT_PUBLIC_BRAND_API_KEY;

  try {
    const response = await axios.get(url, {
      params: {
        domain: domain,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error retrieving brand data:', error);
  }
};

export function ComboboxDemo({
  setPlatform,
}: {
  setPlatform: React.Dispatch<
    React.SetStateAction<{
      name: string;
      icon: string;
    }>
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const { data: logo } = useQuery<LogoApiResponse>({
    queryKey: ['logos', value],
    queryFn: async () => retrieveBrandDataFromBrandDev(value),
  });

  const handleChange = useDebounce((event: string) => {
    if (event) {
      setValue(event);
    } else {
      setValue('');
    }
  }, 300);

  const removeDomain = (domain: string) => {
    return domain?.split('.')[0];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          key={value}
        >
          {logo
            ? logo?.brand?.domain
            : value && !logo
            ? value
            : 'select platform'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="w-full !min-w-0">
          <CommandInput
            placeholder="add domain like: netflix(.com)"
            onValueChange={handleChange}
          />
          <CommandList>
            <CommandGroup>
              {logo?.status ? (
                <CommandItem
                  key={value}
                  value={JSON.stringify({
                    name: removeDomain(value),
                    icon: logo?.brand?.logos[0]?.url || '',
                  })}
                  onSelect={(value) => {
                    const data = JSON.parse(value);
                    setPlatform(data);
                    setOpen(false);
                  }}
                  className="cursor-pointer flex justify-between"
                >
                  <div className="size-5 md:size-6">
                    <Avatar>
                      <AvatarImage src={logo?.brand.logos[0]?.url} />
                      <AvatarFallback>{logo?.brand.title}</AvatarFallback>
                    </Avatar>
                  </div>
                  {logo?.brand.domain.replace(/\.com$/, '')}
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      removeDomain(logo?.brand.domain || '') ===
                        removeDomain(value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ) : value ? (
                <CommandItem
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    const findLogo = BRAND_LOGOS.find((item) =>
                      item.name.includes(value.toLowerCase())
                    );
                    setPlatform({
                      name: findLogo?.name || removeDomain(value),
                      icon: findLogo?.icon || removeDomain(value),
                    });
                    setValue(findLogo?.name || removeDomain(value));
                    setOpen(false);
                  }}
                  className="cursor-pointer flex justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar className="size-5 min-w-5 min-h-5 md:min-h-6 md:min-w-6 md:size-6">
                      <AvatarImage
                        src={
                          BRAND_LOGOS.find((item) =>
                            item.name.includes(value.toLowerCase())
                          )?.icon
                        }
                        alt={value}
                      />
                      <AvatarFallback
                        style={{ backgroundColor: getRandomRgbColor() }}
                        className="text-xs size-5 min-w-5 min-h-5 md:min-h-6 md:min-w-6 md:size-6 flex justify-center items-center"
                      >
                        {getInitials(value)}
                      </AvatarFallback>
                    </Avatar>
                    {value.replace(/\.com$/, '')}
                  </div>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      removeDomain(value || '') === removeDomain(value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {!value &&
                BRAND_LOGOS.map((item) => (
                  <CommandItem
                    key={item.name}
                    value={item.name}
                    onSelect={(value) => {
                      setPlatform({
                        name: removeDomain(value),
                        icon: item.icon,
                      });
                      setValue(item.name);
                      setOpen(false);
                    }}
                    className="cursor-pointer flex justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="size-5 md:size-6">
                        <Avatar className="size-4 min-w-4 min-h-4 md:min-h-6 md:min-w-6 md:size-6">
                          <AvatarImage src={item?.icon || ''} alt={item.name} />
                          <AvatarFallback
                            style={{ backgroundColor: getRandomRgbColor() }}
                            className="text-xs size-5 min-w-5 min-h-5 md:min-h-6 md:min-w-6 md:size-6 flex justify-center items-center"
                          >
                            {item.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {item.name}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
