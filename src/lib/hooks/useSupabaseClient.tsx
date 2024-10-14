import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const useSupabaseClient = () => {
  // The `useSession()` hook will be used to get the Clerk `session` object
  const { session } = useSession();
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(session);
    if (!session) {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    }
  }, [session]);

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            // The Clerk `session` object has the getToken() method
            const clerkToken = await session?.getToken({
              // Pass the name of the JWT template you created in the Clerk Dashboard
              // For this tutorial, you named it 'supabase'
              template: 'supabase',
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            // Call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  const client = createClerkSupabaseClient();

  return client;
};

export default useSupabaseClient;
