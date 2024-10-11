'use client';
import { cn } from '@/lib/utils';
import { ChartAreaIcon } from 'lucide-react';
import { useState } from 'react';

const SideBar = () => {
  const items = [
    { name: 'Test1', icon: <ChartAreaIcon /> },
    { name: 'Test2', icon: <ChartAreaIcon /> },
    { name: 'Test3', icon: <ChartAreaIcon /> },
    { name: 'Test4', icon: <ChartAreaIcon /> },
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="!w-[100px] menu h-dvh bg-black">
      <div className="title">Menu</div>
      <ul className="h-full ">
        <li className="item noClick"></li>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={cn('item', {
              active: active === index,
            })}
          >
            <i>
              {item.name}
              <span>{item.icon}</span>
            </i>
          </li>
        ))}
        <li className="item noClick"></li>
      </ul>
    </div>
  );
};

export default SideBar;
