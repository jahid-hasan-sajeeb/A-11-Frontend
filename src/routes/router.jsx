import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";

const HomePage = lazy(() => import("../pages/public/HomePage").then((m) => ({ default: m.HomePage })));
const AllContestsPage = lazy(() => import("../pages/public/AllContestsPage").then((m) => ({ default: m.AllContestsPage })));
const AboutPage = lazy(() => import("../pages/public/AboutPage").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("../pages/public/ContactPage").then((m) => ({ default: m.ContactPage })));
const ContestDetailsPage = lazy(() =>
  import("../pages/public/ContestDetailsPage").then((m) => ({ default: m.ContestDetailsPage }))
);
const PaymentContestPage = lazy(() =>
  import("../pages/public/PaymentContestPage").then((m) => ({ default: m.PaymentContestPage }))
);
const LeaderboardPage = lazy(() =>
  import("../pages/public/LeaderboardPage").then((m) => ({ default: m.LeaderboardPage }))
);
const SuccessStoriesPage = lazy(() =>
  import("../pages/public/SuccessStoriesPage").then((m) => ({ default: m.SuccessStoriesPage }))
);
const HelpCenterPage = lazy(() =>
  import("../pages/public/HelpCenterPage").then((m) => ({ default: m.HelpCenterPage }))
);
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const LoginPage = lazy(() => import("../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const DashboardHomePage = lazy(() =>
  import("../pages/dashboard/DashboardHomePage").then((m) => ({ default: m.DashboardHomePage }))
);
const MyParticipatedContestsPage = lazy(() =>
  import("../pages/dashboard/user/MyParticipatedContestsPage").then((m) => ({ default: m.MyParticipatedContestsPage }))
);
const MyWinningContestsPage = lazy(() =>
  import("../pages/dashboard/user/MyWinningContestsPage").then((m) => ({ default: m.MyWinningContestsPage }))
);
const MyProfilePage = lazy(() => import("../pages/dashboard/user/MyProfilePage").then((m) => ({ default: m.MyProfilePage })));
const MySettingsPage = lazy(() =>
  import("../pages/dashboard/user/MySettingsPage").then((m) => ({ default: m.MySettingsPage }))
);
const AddContestPage = lazy(() => import("../pages/dashboard/creator/AddContestPage").then((m) => ({ default: m.AddContestPage })));
const MyCreatedContestsPage = lazy(() =>
  import("../pages/dashboard/creator/MyCreatedContestsPage").then((m) => ({ default: m.MyCreatedContestsPage }))
);
const EditContestPage = lazy(() => import("../pages/dashboard/creator/EditContestPage").then((m) => ({ default: m.EditContestPage })));
const SubmittedTasksPage = lazy(() =>
  import("../pages/dashboard/creator/SubmittedTasksPage").then((m) => ({ default: m.SubmittedTasksPage }))
);
const ManageUsersPage = lazy(() =>
  import("../pages/dashboard/admin/ManageUsersPage").then((m) => ({ default: m.ManageUsersPage }))
);
const ManageContestsPage = lazy(() =>
  import("../pages/dashboard/admin/ManageContestsPage").then((m) => ({ default: m.ManageContestsPage }))
);
const AdminReportsPage = lazy(() =>
  import("../pages/dashboard/admin/AdminReportsPage").then((m) => ({ default: m.AdminReportsPage }))
);
const AdminCategoriesPage = lazy(() =>
  import("../pages/dashboard/admin/AdminCategoriesPage").then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminSettingsPage = lazy(() =>
  import("../pages/dashboard/admin/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage }))
);

const renderPage = (Component) => (
  <Suspense fallback={<LoadingSpinner full />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: renderPage(HomePage) },
      { path: "all-contests", element: renderPage(AllContestsPage) },
      { path: "about", element: renderPage(AboutPage) },
      { path: "contact", element: renderPage(ContactPage) },
      { path: "leaderboard", element: renderPage(LeaderboardPage) },
      { path: "success-stories", element: renderPage(SuccessStoriesPage) },
      { path: "help-center", element: renderPage(HelpCenterPage) },
      { path: "contest/:id", element: renderPage(ContestDetailsPage) },
      {
        path: "payment/contest/:id",
        element: (
          <PrivateRoute>
            {renderPage(PaymentContestPage)}
          </PrivateRoute>
        ),
      },
      { path: "login", element: renderPage(LoginPage) },
      { path: "register", element: renderPage(RegisterPage) },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: renderPage(DashboardHomePage) },
          { path: "my-participated-contests", element: renderPage(MyParticipatedContestsPage) },
          { path: "my-winning-contests", element: renderPage(MyWinningContestsPage) },
          { path: "my-profile", element: renderPage(MyProfilePage) },
          { path: "my-settings", element: renderPage(MySettingsPage) },
          {
            path: "add-contest",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                {renderPage(AddContestPage)}
              </RoleRoute>
            ),
          },
          {
            path: "my-created-contests",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                {renderPage(MyCreatedContestsPage)}
              </RoleRoute>
            ),
          },
          {
            path: "edit-contest/:id",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                {renderPage(EditContestPage)}
              </RoleRoute>
            ),
          },
          {
            path: "submitted-tasks",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                {renderPage(SubmittedTasksPage)}
              </RoleRoute>
            ),
          },
          {
            path: "manage-users",
            element: (
              <RoleRoute allow={["admin"]}>
                {renderPage(ManageUsersPage)}
              </RoleRoute>
            ),
          },
          {
            path: "manage-contests",
            element: (
              <RoleRoute allow={["admin"]}>
                {renderPage(ManageContestsPage)}
              </RoleRoute>
            ),
          },
          {
            path: "admin-reports",
            element: (
              <RoleRoute allow={["admin"]}>
                {renderPage(AdminReportsPage)}
              </RoleRoute>
            ),
          },
          {
            path: "admin-categories",
            element: (
              <RoleRoute allow={["admin"]}>
                {renderPage(AdminCategoriesPage)}
              </RoleRoute>
            ),
          },
          {
            path: "admin-settings",
            element: (
              <RoleRoute allow={["admin"]}>
                {renderPage(AdminSettingsPage)}
              </RoleRoute>
            ),
          },
        ],
      },
      { path: "*", element: renderPage(NotFoundPage) },
    ],
  },
]);
