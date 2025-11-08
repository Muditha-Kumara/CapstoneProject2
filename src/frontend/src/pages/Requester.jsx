export default function Requester({ user }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Requester Home</h1>
      <p>Welcome, {user?.name || 'Requester'}!</p>
    </div>
  );
}
