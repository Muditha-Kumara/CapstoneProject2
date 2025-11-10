export default function Admin({ user }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Admin Home</h1>
      <p>Welcome, {user?.name || 'Admin'}!</p>
    </div>
  );
}
