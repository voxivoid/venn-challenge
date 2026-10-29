import { Outlet, createBrowserRouter, type RouteObject } from "react-router";
import { DefaultLayout } from "@/layouts/default-layout/default-layout";
import { OnboardingPage } from "@/pages/onboarding-page/onboarding-page";

export const routes: RouteObject[] = [
  {
    element: (
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    ),
    children: [{ index: true, Component: OnboardingPage }],
  },
];

export const router = createBrowserRouter(routes);
