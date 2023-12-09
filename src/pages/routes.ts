import { lazy } from "react";

const Welcome = lazy(() => import("./Welcome"));
const MySubscriptions = lazy(() => import("./MySubscriptions"));
const MyServices = lazy(() => import("./MyServices"));
const CreateService = lazy(() => import("./CreateService"));
const Services = lazy(() => import("./Services"));

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
  {
    path: "/create-service",
    component: CreateService,
  },
  {
    path: "/services",
    component: Services,
  },
  {
    path: "/services/:serviceId",
    component: Services,
  },
];
