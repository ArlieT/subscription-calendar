import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-end p-2 md:p-10 md:h-16">
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <div className="">
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: dark,
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
