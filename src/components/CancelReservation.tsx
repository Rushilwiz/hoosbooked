"use client";

interface Props {
  bookingId: string;
  small?: boolean;
}

const CancelReservation = ({ bookingId, small }: Props) => {
  const cancelReservation = () => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    fetch(`/api/booking/${bookingId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Reservation cancelled.");
          window.location.href = `/`;
        } else {
          alert("Failed to cancel reservation.");
        }
      })
      .catch(() => {
        alert("Failed to cancel reservation.");
      });
  };

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        cancelReservation();
      }}
      className={
        small
          ? "text-red-600 hover:underline"
          : "text-red-500 text-sm font-bold outline-2 outline-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition"
      }
    >
      Cancel Reservation
    </a>
  );
};

export default CancelReservation;
