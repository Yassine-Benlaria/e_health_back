# E-Health Backend

Welcome to the E-Health Backend repository! This repository contains the source code for the backend of the E-Health web application. E-Health is designed to manage patient and doctor health information, enabling features such as telemedicine and online appointment scheduling. This README will guide you through the setup and provide an overview of the backend components.

## Technologies Used

The E-Health Backend is built using the following technologies:

- **Node.js:** A JavaScript runtime environment for building server-side applications.
- **Express.js:** A web application framework for Node.js that simplifies the development of APIs.
- **MongoDB:** A NoSQL database used for storing patient and doctor health information.
- **JSON Web Tokens (JWT):** Used for authentication and authorization.
- **NPM:** Package managers for installing and managing project dependencies.

## Installation and Setup

To set up the E-Health Backend on your local machine, follow these steps:

1. Clone this repository to your local machine.

    ```bash
    git clone "https://github.com/Yassine-Benlaria/e_health_back"
    ```

2. Navigate to the project directory.

    ```bash
    cd e-health-backend
    ```

3. Install the required dependencies.

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory of the project and configure the following environment variables:

    ```env
    PORT=3000
    DATABASE_URL="mongodb://localhost/ehealth" # Replace with your MongoDB connection string
    JWT_SECRET="your-secret-key" # Replace with a strong and unique secret key
    ```

5. Start the application.

    ```bash
    npm run dev
    ```

The backend server will now be running on `http://localhost:3000`.

## API Routes

The E-Health Backend provides various API routes to interact with the platform. Here are some of the main routes:

- `/api/patient`: Manages patient information, including appointment scheduling and teleconsultations.
- `/api/medecin`: Manages doctor information and availability for teleconsultations.
- `/api/auth`: Handles user authentication and authorization.
- `/api/appointment`: Manages appointments and scheduling.
- `/api/admin`: Provides administrative functionalities for the platform.

Please refer to the API documentation or code comments for detailed information about available routes and their functionalities.

## Authentication

The backend uses JWT (JSON Web Tokens) for user authentication and authorization. Users must obtain a valid JWT token by logging in to access protected routes.


Thank you for using E-Health! If you have any questions or need assistance, feel free to reach out to us. Happy coding!
