import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout/Layout'

// Ленивая загрузка страниц
const Home = lazy(() => import('./Pages/Home'))
const Courses = lazy(() => import('./Pages/Courses'))
const Services = lazy(() => import('./Pages/Services'))
const News = lazy(() => import('./Pages/News'))
const DetailPage = lazy(() => import('./Pages/DetailPage'))

// Компонент загрузки
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4 mx-auto"></div>
      <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
    </div>
  </div>
)

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          )
        },
        {
          path: "courses",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Courses />
            </Suspense>
          )
        },
        {
          path: "services",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Services />
            </Suspense>
          )
        },
        {
          path: "news",
          element: (
            <Suspense fallback={<PageLoader />}>
              <News />
            </Suspense>
          )
        },
        {
          path: "detail/:type/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <DetailPage />
            </Suspense>
          )
        }
      ]
    }
  ], {
    future: {
      v7_startTransition: true
    }
  });

  return <RouterProvider router={router} />
}

export default App