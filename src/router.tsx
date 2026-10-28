import { createBrowserRouter, type RouteObject } from 'react-router'
import { IndexPage } from '@/routes'

export const routes: RouteObject[] = [{ path: '/', Component: IndexPage }]

export const router = createBrowserRouter(routes)
