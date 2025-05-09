# **Online Voting & Survey System**

## Student Number: 12192856
## Student Name: Chasen Wang

A comprehensive web application for creating, managing, and collecting responses to surveys and polls. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 📋 Features

- **User Authentication**: Secure login and registration system
- **Survey Management**: Create, edit, activate/deactivate, and delete surveys
- **Question Types**: Support for single-choice (radio) and multiple-choice (checkbox) questions
- **Public Voting**: Share surveys via unique links for public participation
- **Results Dashboard**: Visualize survey results with interactive charts
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## 🚀 Project Setup Instructions

### **Backend Setup**
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
   or
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   yarn start
   ```
   or
   ```bash
   npm start
   ```
   The server will run on http://localhost:5000

### **Frontend Setup**
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
   or
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   yarn start
   ```
   or
   ```bash
   npm start
   ```
   The application will open in your default browser at http://localhost:3000

### **Production Build**
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. The build files can be served using the Express backend or a dedicated static file server.

## 📁 Project Structure

```
sdlapps/
├── backend/              # Node.js/Express server
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── frontend/             # React application
    ├── public/           # Static files
    └── src/              # Source files
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        ├── services/     # API services
        ├── context/      # React context providers
        ├── utils/        # Utility functions
        └── App.js        # Main application component
```

## 📱 Key Features & Usage

### Creating a Survey
1. Login to your account
2. Navigate to the "New Survey" page
3. Enter the survey title and description
4. Add questions and response options
5. Click "Save" to create your survey

### Managing Surveys
- View all your surveys on the dashboard
- Activate/deactivate surveys to control availability
- Edit surveys to modify questions or options
- Delete surveys that are no longer needed

### Collecting Responses
- Share your survey's unique URL with participants
- View real-time statistics as responses come in
- Analyze results with visualized charts and graphs

## 🧪 Testing

Run tests with:
```bash
cd frontend
npm test
```

This launches the test runner in interactive watch mode. The project uses Jest and React Testing Library for unit and integration tests.

## 🔧 Technologies

- **Frontend**: React, Material UI, eCharts
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: AWS CI/CD pipeline

## 📖 CI/CD Pipeline Details

### **CI/CD Workflow**
The CI/CD pipeline is configured using **GitHub Actions**. Below are the key steps:

1. **Trigger**:
   - The pipeline is triggered on every push to the `master` branch.

2. **Backend CI**:
   - The pipeline installs dependencies for the backend.
   - It deploys the backend to **AWS**.

3. **Frontend CI**:
   - The pipeline installs dependencies for the frontend.
   - It deploys the frontend to **AWS**.

### **Environment Variables**
The following secrets are configured in the GitHub repository:
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `PORT`: Backend server port.

### **Deployment**
- The backend and frontend are deployed to AWS using the CI/CD pipeline.
- Ensure AWS credentials are configured in the GitHub repository for deployment.

For more details, refer to the ci.yml file.

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [Material UI Documentation](https://mui.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
