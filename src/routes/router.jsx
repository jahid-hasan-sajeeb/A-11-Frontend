import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { HomePage } from "../pages/public/HomePage";
import { AllContestsPage } from "../pages/public/AllContestsPage";
import { ContestDetailsPage } from "../pages/public/ContestDetailsPage";
import { PaymentContestPage } from "../pages/public/PaymentContestPage";
import { LeaderboardPage } from "../pages/public/LeaderboardPage";
import { SuccessStoriesPage } from "../pages/public/SuccessStoriesPage";
import { HelpCenterPage } from "../pages/public/HelpCenterPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardHomePage } from "../pages/dashboard/DashboardHomePage";
import { MyParticipatedContestsPage } from "../pages/dashboard/user/MyParticipatedContestsPage";
import { MyWinningContestsPage } from "../pages/dashboard/user/MyWinningContestsPage";
import { MyProfilePage } from "../pages/dashboard/user/MyProfilePage";
import { AddContestPage } from "../pages/dashboard/creator/AddContestPage";
import { MyCreatedContestsPage } from "../pages/dashboard/creator/MyCreatedContestsPage";
import { EditContestPage } from "../pages/dashboard/creator/EditContestPage";
import { SubmittedTasksPage } from "../pages/dashboard/creator/SubmittedTasksPage";
import { ManageUsersPage } from "../pages/dashboard/admin/ManageUsersPage";
import { ManageContestsPage } from "../pages/dashboard/admin/ManageContestsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "all-contests", element: <AllContestsPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "success-stories", element: <SuccessStoriesPage /> },
      { path: "help-center", element: <HelpCenterPage /> },
      {
        path: "contest/:id",
        element: (
          <PrivateRoute>
            <ContestDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/contest/:id",
        element: (
          <PrivateRoute>
            <PaymentContestPage />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardHomePage /> },
          { path: "my-participated-contests", element: <MyParticipatedContestsPage /> },
          { path: "my-winning-contests", element: <MyWinningContestsPage /> },
          { path: "my-profile", element: <MyProfilePage /> },
          {
            path: "add-contest",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                <AddContestPage />
              </RoleRoute>
            ),
          },
          {
            path: "my-created-contests",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                <MyCreatedContestsPage />
              </RoleRoute>
            ),
          },
          {
            path: "edit-contest/:id",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                <EditContestPage />
              </RoleRoute>
            ),
          },
          {
            path: "submitted-tasks",
            element: (
              <RoleRoute allow={["creator", "admin"]}>
                <SubmittedTasksPage />
              </RoleRoute>
            ),
          },
          {
            path: "manage-users",
            element: (
              <RoleRoute allow={["admin"]}>
                <ManageUsersPage />
              </RoleRoute>
            ),
          },
          {
            path: "manage-contests",
            element: (
              <RoleRoute allow={["admin"]}>
                <ManageContestsPage />
              </RoleRoute>
            ),
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
