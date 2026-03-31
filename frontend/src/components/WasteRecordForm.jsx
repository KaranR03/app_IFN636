import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const WasteRecordForm = ({ records, setRecords, editingRecord, setEditingRecord }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    wasteType: 'General', quantity: '', unit: 'kg',
    location: '', collectionDate: '', status: 'Pending', notes: '',
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        wasteType: editingRecord.wasteType,
        quantity: editingRecord.quantity,
        unit: editingRecord.unit,
        location: editingRecord.location,
        collectionDate: editingRecord.collectionDate
          ? editingRecord.collectionDate.substring(0, 10) : '',
        status: editingRecord.status,
        notes: editingRecord.notes || '',
      });
    } else {
      setFormData({
        wasteType: 'General', quantity: '', unit: 'kg',
        location: '', collectionDate: '', status: 'Pending', notes: '',
      });
    }
  }, [editingRecord]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        const response = await axiosInstance.put(
          `/api/waste-records/${editingRecord._id}`, formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setRecords(records.map((r) => (r._id === response.data._id ? response.data : r)));
      } else {
        const response = await axiosInstance.post('/api/waste-records', formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setRecords([...records, response.data]);
      }
      setEditingRecord(null);
      setFormData({
        wasteType: 'General', quantity: '', unit: 'kg',
        location: '', collectionDate: '', status: 'Pending', notes: '',
      });
    } catch (error) {
      alert('Failed to save waste record.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingRecord ? 'Edit Waste Record' : 'Add Waste Record'}
      </h1>
      <select value={formData.wasteType}
        onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required>
        <option value="General">General</option>
        <option value="Recyclable">Recyclable</option>
        <option value="Hazardous">Hazardous</option>
        <option value="Organic">Organic</option>
        <option value="Electronic">Electronic</option>
      </select>
      <input type="number" placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required min="0" />
      <select value={formData.unit}
        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        className="w-full mb-4 p-2 border rounded">
        <option value="kg">kg</option>
        <option value="tonnes">tonnes</option>
        <option value="litres">litres</option>
        <option value="bags">bags</option>
      </select>
      <input type="text" placeholder="Collection Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required />
      <input type="date" value={formData.collectionDate}
        onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded" required />
      <select value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full mb-4 p-2 border rounded">
        <option value="Pending">Pending</option>
        <option value="Collected">Collected</option>
        <option value="Disposed">Disposed</option>
      </select>
      <textarea placeholder="Notes (optional)" value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="w-full mb-4 p-2 border rounded" rows="3" />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        {editingRecord ? 'Update Record' : 'Add Record'}
      </button>
      {editingRecord && (
        <button type="button" onClick={() => setEditingRecord(null)}
          className="w-full mt-2 bg-gray-400 text-white p-2 rounded">
          Cancel
        </button>
      )}
    </form>
  );
};

export default WasteRecordForm;