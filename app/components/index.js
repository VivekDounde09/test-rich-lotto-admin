import React from 'react';
import loadable from '../utils/loadable';
import Loading from './Loading';

// Loading - No need to lazy load this component
export { default as Loading } from './Loading';

export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <Loading />,
});

export const UserDetails = loadable(() => import('./UserDetails'), {
  fallback: <Loading />,
});
export const DateRange = loadable(() => import('./DateRange'), {
  fallback: <Loading />,
});

export const TablePagination = loadable(() => import('./TablePagination'), {
  fallback: <Loading />,
});
export const TablePaginationArray = loadable(
  () => import('./TablePaginationArray'),
  {
    fallback: <Loading />,
  },
);
export const ConfirmationModal = loadable(
  () => import('./UserPage/ConfirmationModal'),
  {
    fallback: <Loading />,
  },
);
export const CreateForm = loadable(() => import('./UserPage/CreateForm'), {
  fallback: <Loading />,
});
export const SequenceTable = loadable(
  () => import('./PoolPage/SequenceTable'),
  {
    fallback: <Loading />,
  },
);
export const EditForm = loadable(() => import('./UserPage/EditForm'), {
  fallback: <Loading />,
});
export const PreviewImage = loadable(() => import('./PreviewImage'), {
  fallback: <Loading />,
});

export const AddPool = loadable(() => import('./PoolPage/AddPool'), {
  fallback: <Loading />,
});
export const AllPastPool = loadable(() => import('./PoolPage/AllPastPool'), {
  fallback: <Loading />,
});
export const AllCurrentPools = loadable(
  () => import('./PoolPage/AllCurrentPools'),
  {
    fallback: <Loading />,
  },
);
export const Deposit = loadable(() => import('./Deposit'), {
  fallback: <Loading />,
});
export const Withdrawal = loadable(() => import('./Withdrawal'), {
  fallback: <Loading />,
});
export const PoolTimer = loadable(() => import('./PoolTimer'), {
  fallback: <Loading />,
});
export const PoolDetails = loadable(() => import('./PoolPage/PoolDetails'), {
  fallback: <Loading />,
});
export const CurrentPoolCard = loadable(
  () => import('./PoolPage/CurrentPoolCard'),
  {
    fallback: <Loading />,
  },
);

export const PastPool = loadable(() => import('./PoolPage/PastPool'), {
  fallback: <Loading />,
});

export const RejectText = loadable(() => import('./RejectText'), {
  fallback: <Loading />,
});

export const PoolConfirmation = loadable(
  () => import('./PoolPage/PoolConfirmation'),
  {
    fallback: <Loading />,
  },
);
