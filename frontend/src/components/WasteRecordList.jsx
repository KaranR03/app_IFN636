import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Collected: 'bg-blue-100 text-blue-800',
  Disposed: 'bg-green-100 text-green-800',
};

const WasteRecordList = ({ records, setRecords, setEditingRecord }) => {
  const { user } = useAuth();

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axiosInstance.delete(`/api/waste-records/${recordId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecords(records.filter((r) => r._id !== recordId));
    } catch (error) {
      alert('Only admins can delete records.');
    }
  };

  if (records.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No waste records found. Add your first record above.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Waste Collection Records</h2>
      {records.map((record) => (
        <div key={record._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{record.wasteType} Waste</h3>
              <p className="text-sm text-gray-700">📍 {record.location}</p>
              <p className="text-sm text-gray-700">⚖️ {record.quantity} {record.unit}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(record.collectionDate).toLocaleDateString()}
              </p>
              {record.notes && <p className="text-sm text-gray-500 mt-1">📝 {record.notes}</p>}
              {record.createdBy && (
                <p className="text-xs text-gray-400 mt-1">
                  Added by: {record.createdBy.name || record.createdBy.email}
                </p>
              )}
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[record.status]}`}>
              {record.status}
            </span>
          </div>
          <div className="mt-3">
            <button onClick={() => setEditingRecord(record)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">
              Edit
            </button>
            {user.role === 'admin' && (
              <button onClick={() => handleDelete(record._id)}
                className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WasteRecordList;