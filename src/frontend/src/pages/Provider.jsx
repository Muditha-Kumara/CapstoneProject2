export default function Provider({ user }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Food Provider Home</h1>
      <p>Welcome, {user?.name || 'Provider'}!</p>
    </div>
  );
}
