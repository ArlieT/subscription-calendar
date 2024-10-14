import { SignedOut, SignedIn, UserButton, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { dark } from '@clerk/themes';

const Navbar = () => {
  return (
    <nav className="flex justify-end p-2 md:p-10 h-16 ">
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
