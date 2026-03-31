const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const WasteRecord = require('../models/WasteRecord');
const {
  createWasteRecord,
  getWasteRecords,
  updateWasteRecord,
  deleteWasteRecord,
} = require('../controllers/wasteRecordController');
const { expect } = chai;

// ─── CREATE ───────────────────────────────────────────────
describe('AddWasteRecord Function Test', () => {

  it('should create a new waste record successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'staff' },
      body: {
        wasteType: 'General',
        quantity: 50,
        unit: 'kg',
        location: 'Brisbane',
        collectionDate: '2025-12-31',
        status: 'Pending',
        notes: 'Test note',
      },
    };

    const createdRecord = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user._id };
    const createStub = sinon.stub(WasteRecord, 'create').resolves(createdRecord);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createWasteRecord(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdRecord)).to.be.true;

    createStub.restore();
  });

  it('should return 400 if an error occurs during creation', async () => {
    const createStub = sinon.stub(WasteRecord, 'create').throws(new Error('DB Error'));

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'staff' },
      body: { wasteType: 'General', quantity: 50, location: 'Brisbane' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createWasteRecord(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    createStub.restore();
  });

});

// ─── READ ─────────────────────────────────────────────────
describe('GetWasteRecords Function Test', () => {

  it('should return waste records for the user', async () => {
    const fakeRecords = [
      { _id: new mongoose.Types.ObjectId(), wasteType: 'General', location: 'Brisbane' },
    ];

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'staff' },
    };

    const populateStub = { populate: sinon.stub().returnsThis(), sort: sinon.stub().resolves(fakeRecords) };
    const findStub = sinon.stub(WasteRecord, 'find').returns(populateStub);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getWasteRecords(req, res);

    expect(res.json.calledWith(fakeRecords)).to.be.true;

    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(WasteRecord, 'find').throws(new Error('DB Error'));

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'staff' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await getWasteRecords(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    findStub.restore();
  });

});

// ─── UPDATE ───────────────────────────────────────────────
describe('UpdateWasteRecord Function Test', () => {

  it('should update a waste record successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const recordId = new mongoose.Types.ObjectId();

    const fakeRecord = { _id: recordId, createdBy: userId, wasteType: 'General' };
    const updatedRecord = { ...fakeRecord, wasteType: 'Recyclable' };

    const findByIdStub = sinon.stub(WasteRecord, 'findById').resolves(fakeRecord);
    const findByIdAndUpdateStub = sinon.stub(WasteRecord, 'findByIdAndUpdate').resolves(updatedRecord);

    const req = {
      user: { _id: userId, role: 'admin' },
      params: { id: recordId.toString() },
      body: { wasteType: 'Recyclable' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateWasteRecord(req, res);

    expect(res.json.calledWith(updatedRecord)).to.be.true;

    findByIdStub.restore();
    findByIdAndUpdateStub.restore();
  });

  it('should return 404 if record not found', async () => {
    const findByIdStub = sinon.stub(WasteRecord, 'findById').resolves(null);

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'admin' },
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: { wasteType: 'Recyclable' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateWasteRecord(req, res);

    expect(res.status.calledWith(404)).to.be.true;

    findByIdStub.restore();
  });

});

// ─── DELETE ───────────────────────────────────────────────
describe('DeleteWasteRecord Function Test', () => {

  it('should delete a waste record successfully', async () => {
    const fakeRecord = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
      deleteOne: sinon.stub().resolves(),
    };

    const findByIdStub = sinon.stub(WasteRecord, 'findById').resolves(fakeRecord);

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'admin' },
      params: { id: fakeRecord._id.toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteWasteRecord(req, res);

    expect(res.json.calledWithMatch({ message: 'Record deleted successfully' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if record not found', async () => {
    const findByIdStub = sinon.stub(WasteRecord, 'findById').resolves(null);

    const req = {
      user: { _id: new mongoose.Types.ObjectId(), role: 'admin' },
      params: { id: new mongoose.Types.ObjectId().toString() },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteWasteRecord(req, res);

    expect(res.status.calledWith(404)).to.be.true;

    findByIdStub.restore();
  });

});