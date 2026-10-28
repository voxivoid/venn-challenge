import { createBrowserRouter, type RouteObject } from "react-router";
import { OnboardingPage } from "@/pages/onboarding-page";

export const routes: RouteObject[] = [{ path: "/", Component: OnboardingPage }];

export const router = createBrowserRouter(routes);
