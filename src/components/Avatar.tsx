import { cn, getRandomRgbColor } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";

const AvatarFallbackColored = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [bgColor, setBgColor] = useState("");
  useEffect(() => {
    const randomColor = getRandomRgbColor();
    setBgColor(randomColor);
  }, []);

  return (
    <AvatarFallback
      {...props}
      style={{
        background: `linear-gradient(135deg, ${bgColor}, rgb(140, 160, 250))`,
      }}
      className={cn(
        "w-full text-[10px] flex justify-center items-center",
        className
      )}
    >
      {children}
    </AvatarFallback>
  );
};

export default AvatarFallbackColored;
