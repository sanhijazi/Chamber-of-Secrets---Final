import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import Home from './pages/home';
import PageNotFound from './pages/page-not-found/page_not_found';
import Problem from './pages/problem/problem';
import Causes from './pages/causes/causes';
import Effect from './pages/effect/effect';
import Initiative from './pages/initiative/initiative';

export const router = createHashRouter(
  [
    {
      path: '/',
      element: <Home />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/problem',
      element: <Problem />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/Causes',
      element: <Causes />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/Effect',
      element: <Effect />,
      errorElement: <PageNotFound />,
    },
    {
      path: '/initiative',
      element: <Initiative />,
      errorElement: <PageNotFound />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_prependBasename: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    },
  }
);
