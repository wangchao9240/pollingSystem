const chai = require("chai")
const sinon = require("sinon")
const mongoose = require("mongoose")
const { expect } = chai
const Survey = require("../models/Survey")
const {
  addOrUpdateSurvey,
  deleteSurveyItemById,
  querySurvey,
} = require("../controllers/surveyController")

describe("Survey CURD operations", () => {
  afterEach(() => {
    sinon.restore()
  })

  it("should create a new survey", async () => {
    const surveyData = {
      question: "What is your favorite color?",
      type: "multiple-choice",
      options: [
        { optionKey: "A", optionValue: "Red" },
        { optionKey: "B", optionValue: "Blue" },
        { optionKey: "C", optionValue: "Green" },
      ],
      correctAnswer: "B",
    }

    const savedSurvey = {
      ...surveyData,
      _id: mongoose.Types.ObjectId(),
      createdAt: new Date(),
      modifyAt: new Date(),
    }

    const req = {
      body: surveyData,
    }

    const res = {
      json: sinon.spy(),
    }

    // Instead of stubbing save, stub the entire model creation and save process
    const mockSurvey = savedSurvey
    sinon.stub(Survey.prototype, "save").callsFake(function () {
      // Copy properties from mock to this
      Object.assign(this, mockSurvey)
      return Promise.resolve()
    })

    // Call the controller method
    await addOrUpdateSurvey(req, res)

    // Check that the response was called with correct code and message
    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.equal("New survey has been created")
  })

  it("should update an existing survey", async () => {
    // Create survey data with an ID to simulate update
    const surveyId = new mongoose.Types.ObjectId().toString()
    const surveyData = {
      _id: surveyId,
      question: "What is your favorite color?",
      type: "multiple-choice",
      options: [
        { optionKey: "A", optionValue: "Red" },
        { optionKey: "B", optionValue: "Blue" },
        { optionKey: "C", optionValue: "Green" },
      ],
      correctAnswer: "B",
    }

    const updatedSurvey = {
      ...surveyData,
      modifyAt: new Date(),
    }

    const req = {
      body: surveyData, // The client sends this data to update
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the findByIdAndUpdate method that's used for updates
    // This is the key fix - we need to stub this method
    sinon.stub(Survey, "findByIdAndUpdate").resolves(updatedSurvey)

    // Call the controller method
    await addOrUpdateSurvey(req, res)

    // Check that findByIdAndUpdate was called with the right parameters
    expect(Survey.findByIdAndUpdate.calledOnce).to.be.true
    expect(Survey.findByIdAndUpdate.firstCall.args[0]).to.equal(surveyId)

    // Check that the response was called with correct code and message
    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.equal("Survey has been updated")
  })

  it("delete an existing survey", async () => {
    const surveyId = new mongoose.Types.ObjectId().toString()
    const req = {
      body: {
        _id: surveyId,
      },
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the findByIdAndDelete method
    sinon.stub(Survey, "findByIdAndDelete").resolves({ _id: surveyId })

    // Call the controller method
    await deleteSurveyItemById(req, res)

    // Check that findByIdAndDelete was called with the right parameters
    expect(Survey.findByIdAndDelete.calledOnce).to.be.true
    expect(Survey.findByIdAndDelete.firstCall.args[0]).to.equal(surveyId)

    // Check that the response was called with correct code and message
    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.equal("Survey has been deleted")
  })

  it("should show survey list", async () => {
    const req = {
      query: { page: 1, pageSize: 10 },
    }

    const res = {
      json: sinon.spy(),
    }

    // Mock survey data
    const mockSurveys = [
      {
        _id: "1234567890abcdef12345678",
        question: "What is your favorite color?",
        type: "multiple-choice",
        options: [
          { optionKey: "A", optionValue: "Red" },
          { optionKey: "B", optionValue: "Blue" },
          { optionKey: "C", optionValue: "Green" },
        ],
        correctAnswer: "B",
      }
    ];

    // Create a chainable query mock
    const queryMock = {
      skip: sinon.stub().returnsThis(),
      limit: sinon.stub().resolves(mockSurveys)
    };

    // Stub Survey.find to return our chainable query mock
    sinon.stub(Survey, "find").returns(queryMock);
    sinon.stub(Survey, "countDocuments").resolves(10);

    // Call the controller method
    await querySurvey(req, res);

    // Check that find was called once
    expect(Survey.find.calledOnce).to.be.true;
    
    // Check that skip was called with the right parameters
    expect(queryMock.skip.calledOnce).to.be.true;
    expect(queryMock.skip.firstCall.args[0]).to.equal(0); // page 1, skip 0
    
    // Check that limit was called with the right parameters
    expect(queryMock.limit.calledOnce).to.be.true;
    expect(queryMock.limit.firstCall.args[0]).to.equal(10);

    // Check that the response was called with correct code and message
    expect(res.json.calledOnce).to.be.true;

    const response = res.json.firstCall.args[0];
    expect(response.code).to.equal(200);
    expect(response.message).to.equal("Surveys fetched successfully");
    expect(response.data.surveyList).to.be.an("array");
    expect(response.data.total).to.equal(10);
  })
})

describe("Survey CURD operations with invalid data", () => {
  it('should return 400 when invalid data for create survey', async () => {
    const req = {
      body: {
        question: "",
        type: "multiple-choice",
        options: [
          { optionKey: "A", optionValue: "Red" },
          { optionKey: "B", optionValue: "Blue" },
          { optionKey: "C", optionValue: "Green" },
        ],
        correctAnswer: "B",
      },
    }

    const res = {
      json: sinon.spy(),
    }

    await addOrUpdateSurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(400)
    expect(response.message).to.equal("Invalid survey data")
  })

  it('should return 400 when invalid data for update survey', async () => {
    const req = {
      body: {
        _id: "1234567890abcdef12345678",
        question: "",
        type: "multiple-choice",
        options: [
          { optionKey: "A", optionValue: "Red" },
          { optionKey: "B", optionValue: "Blue" },
          { optionKey: "C", optionValue: "Green" },
        ],
        correctAnswer: "B",
      },
    }

    const res = {
      json: sinon.spy(),
    }

    await addOrUpdateSurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(400)
    expect(response.message).to.equal("Invalid survey data")
  })

  it('should return 404 when invalid data for delete survey', async () => {
    const req = {
      body: {
        _id: "invalid_id",
      },
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the findByIdAndDelete method
    sinon.stub(Survey, "findByIdAndDelete").resolves(null)

    await deleteSurveyItemById(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(404)
    expect(response.message).to.equal("Survey not found")
  })

  it('should return 500 when suvery list error', async () => {
    const req = {
      query: { page: 1, pageSize: 10 },
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the find method to throw an error
    sinon.stub(Survey, "find").throws(new Error("Database error"))

    await querySurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(500)
    expect(response.message).to.equal("Database error")
  })
})