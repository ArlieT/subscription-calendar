import { SignedOut, SignedIn, UserButton, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { dark } from '@clerk/themes';

const Navbar = () => {
  return (
    <nav className="flex p-2 justify-end h-16 ">
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            baseTheme: dark,
          }}
        />
      </SignedIn>
    </nav>
  );
};

export default Navbar;
