# TO-DOoodel

A single Page Application for Nirvedha fullstack developer Interview.

Welcome to the TO-DOoodel project repository! This single-page 'To-Do' application has been developed using the MEAN stack framework (MongoDB, AngularJS, Express and Node.js). I have met all the specified requirements and have added some extra features such as password encryption using bcrypt,session creation using JWT tokens ,  backend validation pre hooks, and frontend user validation logic for user authentication and autharisation with the to do application.

## Technologies Used

- **Frontend Framework**: Angular JS
- **Frontend UI Framework**: AdminLTE Dashboard 3 for CSS
- **Backend**: Node.js (version 10.24)
- **Database**: MongoDB with Mongoose (version 4.4)

## Project Setup

To run the project locally, please follow these steps:

1. **Node.js and MongoDB**: Make sure you have Node.js (version 10.24) and MongoDB installed on your system.

2. **Clone the Project**: Clone this repository to your local machine.

3. **Install Dependencies**: Navigate to the project directory in your command prompt or terminal and run the following command to install the project dependencies:

   ```bash
   npm install
   ```
4. **Start the Server**: Start the server by running either of the following commands:
 ```bash
   node server.js
        or
    npm start
   ```
The project is configured to run on port 9000 by default. You can access it in your browser at http://localhost:9000.

## Testing

Please thoroughly test all the functionalities implemented in the application. Additionally, you can manually test the RESTful APIs using a REST client. Below is an example of how to interact with one of the APIs for adding users:

- **API Endpoint**: `http://localhost:9000/apis/users`
- **HTTP Method**: POST
- **Request Body** (JSON):
  
  ```json
  {
    "username": "john",
    "email": "abc@gmail.com",
    "password": "qwerty!0"
  }
  ```

  ## Testing and Documentation

The project has undergone both unit and integration testing to ensure its functionality and reliability. If you have any questions or need further assistance, please feel free to contact me.

Thank you for reviewing my TO-DOoodel application! I look forward to your feedback and the opportunity to discuss for the next round in more detail.

