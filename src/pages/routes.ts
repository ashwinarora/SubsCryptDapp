import { lazy } from "react";

const Welcome = lazy(() => import("./Welcome"));
const MySubscriptions = lazy(() => import("./MySubscriptions"));
const MyServices = lazy(() => import("./MyServices"));

export const routes = [
  {
    path: "/",
    component: Welcome,
  },
  {
    path: "/my-subscriptions",
    component: MySubscriptions,
  },
  {
    path: "/my-services",
    component: MyServices,
  },
];
