import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

// Status badge component
function StatusBadge({ status }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-purple-100 text-purple-800',
    fulfilled: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.toUpperCase()}
    </span>
  );
}

// Accept Request Modal
function AcceptRequestModal({ open, onClose, request, onSuccess }) {
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.acceptRequest({
        requestId: request.id,
        estimatedTime: estimatedTime || 'ASAP',
      });
      toast.success('Request accepted successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Accept Request">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Request Details</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Meal Type:</strong> {request?.food_type}</p>
            <p><strong>Children:</strong> {request?.num_children}</p>
            <p><strong>Location:</strong> {request?.location}</p>
            <p><strong>Time:</strong> {request?.meal_time}</p>
            {request?.dietary_needs && (
              <p><strong>Dietary Needs:</strong> {request?.dietary_needs}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Preparation Time (Optional)
          </label>
          <input
            type="text"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g., 30 minutes, 1 hour"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Accepting...' : 'Accept Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Update Order Status Modal
function UpdateStatusModal({ open, onClose, order, onSuccess }) {
  const [status, setStatus] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'processing', label: 'Processing' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready for Pickup/Delivery' },
    { value: 'fulfilled', label: 'Fulfilled/Delivered' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        orderId: order.order_id,
        status,
      };

      if (photoUrl) {
        payload.photoUrl = photoUrl;
      }

      await api.updateOrderStatus(payload);
      toast.success('Order status updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Update Order Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Order Details</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Order ID:</strong> #{order?.order_id?.slice(0, 8)}</p>
            <p><strong>Meal Type:</strong> {order?.food_type}</p>
            <p><strong>Current Status:</strong> {order?.order_status}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            required
          >
            <option value="">Select status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL (Optional)
          </label>
          <span className="block text-xs text-gray-500 mb-2">
            Upload photo of prepared food for verification
          </span>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Cancel Order Modal
function CancelOrderModal({ open, onClose, order, onSuccess }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.cancelOrder({
        orderId: order.order_id,
        reason: reason || 'No reason provided',
      });
      toast.success('Order cancelled successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Cancel Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800 font-medium mb-2">⚠️ Warning</p>
          <p className="text-sm text-red-700">
            This will cancel the order and make the request available for other providers.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Cancellation (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Keep Order
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Provider({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active' | 'completed'
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalOrders: 0,
    mealsServed: 0,
  });
  const [availableRequests, setAvailableRequests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Navigation Guard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsData, requestsData, activeData, completedData] = await Promise.all([
        api.getProviderStats(),
        api.getAvailableRequests({ limit: 50 }),
        api.getProviderOrders({ status: 'processing', limit: 50 }),
        api.getProviderOrders({ status: 'fulfilled', limit: 50 }),
      ]);

      setStats(statsData);
      setAvailableRequests(requestsData.requests || []);
      setActiveOrders(activeData.orders || []);
      setCompletedOrders(completedData.orders || []);
    } catch (err) {
      console.error('Error fetching provider data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAcceptClick = (request) => {
    setSelectedRequest(request);
    setAcceptModalOpen(true);
  };

  const handleUpdateStatusClick = (order) => {
    setSelectedOrder(order);
    setUpdateStatusModalOpen(true);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleActionSuccess = () => {
    fetchData();
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-green-50 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/provider-hero.jpg)', height: '500px' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative mx-auto max-w-6xl px-4 h-full flex items-center">
          <div className="w-full p-4 text-white">
            <h1
              className="text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            >
              Welcome, Food Provider
            </h1>
            <p
              className="mt-3 text-lg font-light drop-shadow-md px-4 py-2 rounded-lg max-w-2xl"
              style={{
                background: 'rgba(0,0,0,0.45)',
                color: '#fff',
                textShadow: '0 1px 6px rgba(0,0,0,0.6)',
              }}
            >
              Accept food requests from children in need, prepare meals with care, and make a direct impact in your community.
            </p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              Active Orders
            </p>
            <div className="text-4xl font-extrabold text-blue-700">{stats.activeOrders}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wide">
              Completed Orders
            </p>
            <div className="text-4xl font-extrabold text-green-700">{stats.completedOrders}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-orange-600 mb-2 uppercase tracking-wide">
              Total Orders
            </p>
            <div className="text-4xl font-extrabold text-orange-700">{stats.totalOrders}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition">
            <p className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">
              Meals Served
            </p>
            <div className="text-4xl font-extrabold text-purple-700">{stats.mealsServed}</div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'available'
                ? 'border-b-4 border-green-600 text-green-700'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Available Requests ({availableRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'active'
                ? 'border-b-4 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'completed'
                ? 'border-b-4 border-purple-600 text-purple-700'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Completed ({completedOrders.length})
          </button>
        </div>

        {/* Available Requests Tab */}
        {activeTab === 'available' && (
          <div className="pb-16">
            {availableRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No available requests at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-green-700">
                          {request.food_type}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Requested by: {request.requester_name}
                        </p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <p>
                        <strong>Children:</strong> {request.num_children}
                      </p>
                      <p>
                        <strong>Location:</strong> {request.location}
                      </p>
                      <p>
                        <strong>Time Needed:</strong> {request.meal_time}
                      </p>
                      <p>
                        <strong>Phone:</strong> {request.phone_number}
                      </p>
                      {request.dietary_needs && (
                        <p>
                          <strong>Dietary Needs:</strong> {request.dietary_needs}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        <strong>Requested:</strong>{' '}
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAcceptClick(request)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Accept Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Orders Tab */}
        {activeTab === 'active' && (
          <div className="pb-16">
            {activeOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No active orders.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Accept requests to start preparing meals.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="bg-white p-6 rounded-2xl shadow-md border border-blue-200 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-blue-700">
                          Order #{order.order_id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Requester: {order.requester_name}
                        </p>
                      </div>
                      <StatusBadge status={order.order_status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                      <div>
                        <p>
                          <strong>Meal Type:</strong> {order.food_type}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {order.quantity} meals
                        </p>
                        <p>
                          <strong>Children:</strong> {order.num_children}
                        </p>
                        <p>
                          <strong>Time Needed:</strong> {order.meal_time}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Location:</strong> {order.location}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.phone_number}
                        </p>
                        {order.dietary_needs && (
                          <p>
                            <strong>Dietary Needs:</strong> {order.dietary_needs}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Accepted:</strong>{' '}
                          {new Date(order.accepted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatusClick(order)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => handleCancelClick(order)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Orders Tab */}
        {activeTab === 'completed' && (
          <div className="pb-16">
            {completedOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No completed orders yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Your completed orders will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow-md">
                  <thead>
                    <tr className="bg-purple-100 text-purple-800">
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Meal Type</th>
                      <th className="py-3 px-4 text-left">Quantity</th>
                      <th className="py-3 px-4 text-left">Requester</th>
                      <th className="py-3 px-4 text-left">Fulfilled</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.map((order) => (
                      <tr key={order.order_id} className="border-b hover:bg-purple-50">
                        <td className="py-3 px-4 font-mono text-sm">
                          #{order.order_id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4">{order.food_type}</td>
                        <td className="py-3 px-4">{order.quantity} meals</td>
                        <td className="py-3 px-4">{order.requester_name}</td>
                        <td className="py-3 px-4">
                          {new Date(order.fulfilled_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.order_status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modals */}
      <AcceptRequestModal
        open={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        request={selectedRequest}
        onSuccess={handleActionSuccess}
      />

      <UpdateStatusModal
        open={updateStatusModalOpen}
        onClose={() => setUpdateStatusModalOpen(false)}
        order={selectedOrder}
        onSuccess={handleActionSuccess}
      />

      <CancelOrderModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        order={selectedOrder}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
