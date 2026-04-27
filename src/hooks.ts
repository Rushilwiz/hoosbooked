import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const useUser = () => {
  const { data, error, isLoading } = useSWR(`/api/user/`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
};

export const useUserPhone = () => {
  const { data, error, isLoading } = useSWR(`/api/user/phone`, fetcher);

  return {
    phone: data,
    isLoading,
    isError: error,
  };
};

export const useUserNotifications = () => {
  const { data, error, isLoading } = useSWR(`/api/user/notifications`, fetcher);

  return {
    notifications: data,
    isLoading,
    isError: error,
  };
};

export const useUserNotificationPreferences = () => {
  const { data, error, isLoading } = useSWR(
    `/api/user/notification-preferences`,
    fetcher,
  );

  return {
    notificationPreferences: data,
    isLoading,
    isError: error,
  };
};

export const useBookingByUser = () => {
  const { data, error, isLoading } = useSWR(`/api/booking`, fetcher);

  return {
    bookings: data,
    isLoading,
    isError: error,
  };
};
