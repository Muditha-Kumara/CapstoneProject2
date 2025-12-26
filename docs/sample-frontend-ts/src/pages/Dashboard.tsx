import { getUser } from "../api/mockApi";

function Dashboard() {
  const user = getUser();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>User: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Dashboard;
