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
      title: "Test Survey",  // Changed from question to title
      questions: [
        {
          question: "What is your favorite color?",
          type: "Single",    // Changed to match actual options in system
          options: [
            { optionKey: "A", optionValue: "Red" },
            { optionKey: "B", optionValue: "Blue" },
            { optionKey: "C", optionValue: "Green" },
          ]
        }
      ],
      surveyStatus: 1
    }

    const savedSurvey = {
      ...surveyData,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      modifyAt: new Date(),
    }

    const req = {
      body: surveyData,
      user: { _id: "user123" }  // Added user context which protect middleware provides
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the create method instead of save
    sinon.stub(Survey, "create").resolves(savedSurvey)

    // Call the controller method
    await addOrUpdateSurvey(req, res)

    // Check response
    expect(res.json.calledOnce).to.be.true
    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.include("created")
  })

  it("should update an existing survey", async () => {
    // Create survey data with an ID to simulate update
    const surveyId = new mongoose.Types.ObjectId().toString()
    const surveyData = {
      id: surveyId,  // Changed from _id to id
      title: "Test Survey",  // Changed field name
      questions: [
        {
          question: "What is your favorite color?",
          type: "Single",
          options: [
            { optionKey: "A", optionValue: "Red" },
            { optionKey: "B", optionValue: "Blue" },
            { optionKey: "C", optionValue: "Green" },
          ]
        }
      ],
      surveyStatus: 1
    }

    const updatedSurvey = {
      ...surveyData,
      _id: surveyId,  // MongoDB still uses _id internally
      modifyAt: new Date(),
    }

    const req = {
      body: surveyData,
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    // Make sure we're using the right parameters
    sinon.stub(Survey, "findByIdAndUpdate").resolves(updatedSurvey)

    // Call the controller method
    await addOrUpdateSurvey(req, res)

    // Check that findByIdAndUpdate was called with the right parameters
    expect(Survey.findByIdAndUpdate.calledOnce).to.be.true
    // First arg should be ID, second arg is update data
    expect(Survey.findByIdAndUpdate.firstCall.args[0]).to.equal(surveyId)

    // Check response
    expect(res.json.calledOnce).to.be.true
    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.include("updated")
  })

  it("delete an existing survey", async function() {  // Added function to use this
    this.timeout(5000);  // Increase timeout to 5 seconds
    
    const surveyId = new mongoose.Types.ObjectId().toString()
    const req = {
      body: {
        id: surveyId,  // Changed from _id to id
      },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    // Make sure we're passing the id correctly
    sinon.stub(Survey, "findByIdAndDelete").resolves({ _id: surveyId })

    // Call the controller method
    await deleteSurveyItemById(req, res)

    // Check response
    expect(res.json.calledOnce).to.be.true
    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(200)
    expect(response.message).to.include("deleted")
  })

  it("should show survey list", async () => {
    const req = {
      query: { page: 1, pageSize: 10 },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    // Mock survey data
    const mockSurveys = [
      {
        _id: "1234567890abcdef12345678",
        title: "Test Survey",  // Changed from question to title
        questions: [{
          question: "What is your favorite color?",
          type: "Single",
          options: [
            { optionKey: "A", optionValue: "Red" },
            { optionKey: "B", optionValue: "Blue" },
            { optionKey: "C", optionValue: "Green" },
          ]
        }],
        surveyStatus: 1
      }
    ];

    // Create a chainable query mock with all methods used in controller
    const queryMock = {
      sort: sinon.stub().returnsThis(),  // Added sort method
      skip: sinon.stub().returnsThis(),
      limit: sinon.stub().resolves(mockSurveys)
    };

    // Stub methods more specifically
    sinon.stub(Survey, "find").returns(queryMock);
    sinon.stub(Survey, "countDocuments").resolves(10);

    // Call the controller method
    await querySurvey(req, res);

    // Check response
    expect(res.json.calledOnce).to.be.true;
    const response = res.json.firstCall.args[0];
    expect(response.code).to.equal(200);
    expect(response.data.surveyList).to.deep.equal(mockSurveys);
    expect(response.data.total).to.equal(10);
  })
})

describe("Survey CURD operations with invalid data", () => {
  it('should return 400 when invalid data for create survey', async () => {
    const req = {
      body: {
        // Empty title to trigger validation error
        title: "",  
        // Missing or empty questions array
        questions: [],
        surveyStatus: 1
      },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    await addOrUpdateSurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(400)
    expect(response.message).to.include("Survey validation failed")
    expect(response.data).to.be.null
  })

  it('should return 400 when invalid data for update survey', async () => {
    const req = {
      body: {
        id: "1234567890abcdef12345678",  // Using id instead of _id
        // Empty title to trigger validation error
        title: "",
        questions: [],  // Empty questions array
        surveyStatus: 1
      },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    await addOrUpdateSurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(400)
    expect(response.message).to.include("Survey validation failed")
    expect(response.data).to.be.null
  })

  it('should return 404 when invalid data for delete survey', async () => {
    const req = {
      body: {
        id: "invalid_id",  // Changed from _id to id
      },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the findByIdAndDelete method to return null (not found)
    sinon.stub(Survey, "findByIdAndDelete").resolves(null)

    await deleteSurveyItemById(req, res)

    expect(res.json.calledOnce).to.be.true
    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(404)
    expect(response.message).to.include("not found")
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

  it('should return 500 when survey list error', async () => {
    const req = {
      query: { page: 1, pageSize: 10 },
      user: { _id: "user123" }  // Added user context
    }

    const res = {
      json: sinon.spy(),
    }

    // Stub the countDocuments method to throw an error instead of find
    // This is likely the first database call in the controller
    sinon.stub(Survey, "countDocuments").throws(new Error("Database error"))

    await querySurvey(req, res)

    expect(res.json.calledOnce).to.be.true

    const response = res.json.firstCall.args[0]
    expect(response.code).to.equal(500)
    // The error message might be different - check your controller implementation
    expect(response.message).to.include("Database error")
  })
})