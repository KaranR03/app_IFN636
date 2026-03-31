import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import WasteRecordForm from '../components/WasteRecordForm';
import WasteRecordList from '../components/WasteRecordList';
import { useAuth } from '../context/AuthContext';

const WasteRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get('/api/waste-records', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRecords(response.data);
      } catch (error) {
        alert('Failed to fetch waste records.');
      }
    };
    fetchRecords();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <WasteRecordForm
        records={records}
        setRecords={setRecords}
        editingRecord={editingRecord}
        setEditingRecord={setEditingRecord}
      />
      <WasteRecordList
        records={records}
        setRecords={setRecords}
        setEditingRecord={setEditingRecord}
      />
    </div>
  );
};

export default WasteRecords;