import { Subscription } from 'src/types';

export const subscriptionsDefault: Subscription[] = [
  {
    id: 1,
    name: 'Netflix subscription',
    cost: 1020,
    billingCycle: 'monthly',
    dueDate: new Date(),
    icon: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
  },
  {
    id: 2,
    name: 'Spotify',
    cost: 1020,
    billingCycle: 'monthly',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    icon: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
  },

  {
    id: 1,
    name: 'Netflix subscription',
    cost: 1020,
    billingCycle: 'monthly',
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 1)),
    icon: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
  },
  {
    id: 2,
    name: 'Spotify',
    cost: 1020,
    billingCycle: 'monthly',
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 1)),
    icon: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
  },
];
