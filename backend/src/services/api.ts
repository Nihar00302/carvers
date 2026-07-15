const API_URL = "http://localhost:5000";


export async function getBookings() {
  const response = await fetch(
    `${API_URL}/api/bookings`
  );

  return response.json();
}



export async function sendBookingToFinance(id: string) {
  const response = await fetch(
    `${API_URL}/api/bookings/${id}/send-finance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
}