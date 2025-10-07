# 🌍 Time-Zone Based Team Scheduler

> A simple web application to help teams across different time zones find the perfect meeting time by overlapping their availability.

This project consists of a React frontend and a Python (FastAPI) backend that work together to provide a seamless scheduling experience.



---
## ✨ Features

-   **Dynamic Inputs:** Select the number of team members joining the meeting.
-   **Time Zone Aware:** Each member can select their local time zone from a comprehensive list.
-   **Availability Input:** Users enter their availability using a simple `datetime-local` input.
-   **Overlap Calculation:** The backend instantly calculates the common available slot for all members.
-   **Localized Results:** The resulting meeting time is displayed in both UTC and each member's local time zone.

---
## 🛠️ Tech Stack

-   **Frontend:**
    -   **Framework:** [React](https://reactjs.org/)
    -   **Dependencies:**
        -   `axios`: For API requests.
        -   `date-fns` & `date-fns-tz`: For robust date and time zone handling.
-   **Backend:**
    -   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) on [Python 3.9+](https://www.python.org/)
    -   **Server:** [Uvicorn](https://www.uvicorn.org/)
    -   **Dependencies:**
        -   `pytz`: For reliable time zone calculations.

---
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need the following software installed on your computer:
-   [Node.js](https://nodejs.org/en/) (which includes npm)
-   [Python 3.9](https://www.python.org/downloads/) or newer

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd time-zone-scheduler
    ```

2.  **Backend Setup (`timezone-scheduler-api`):**
    ```bash
    # Navigate to the backend directory
    cd timezone-scheduler-api

    # Create a Python virtual environment
    python -m venv venv

    # Activate the virtual environment
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate

    # Create a requirements.txt file with the following content:
    ```
    **`requirements.txt`**
    ```
    fastapi
    uvicorn[standard]
    pytz
    ```
    ```bash
    # Install the dependencies from the requirements.txt file
    pip install -r requirements.txt
    ```

3.  **Frontend Setup (`timezone-scheduler-ui`):**
    The `package.json` file in this directory should already contain the necessary dependencies.
    ```json
    "dependencies": {
      "axios": "^1.x.x",
      "date-fns": "^2.x.x",
      "date-fns-tz": "^2.x.x",
      // ... other react dependencies
    }
    ```
    ```bash
    # Navigate to the frontend directory
    cd timezone-scheduler-ui

    # Install all dependencies from package.json
    npm install
    ```

---
## 🏃‍♂️ Running the Application

You will need to run the frontend and backend servers in two separate terminals.

### 1. Running the Backend Server

-   Navigate to the `timezone-scheduler-api` directory.
-   Ensure your virtual environment is active (`(venv)` should be in your prompt).
-   Run the server:
    ```bash
    uvicorn main:app --reload
    ```
-   The backend API will be available at `http://127.0.0.1:8000`.

### 2. Running the Frontend Application

-   Navigate to the `timezone-scheduler-ui` directory.
-   Run the React development server:
    ```bash
    npm start
    ```
-   The application will open in your browser at `http://localhost:3000`.

---
## 📝 API Endpoint

The primary API endpoint used by the application is:

### `POST /calculate-overlap`

This endpoint accepts a list of team members' availabilities and returns the overlapping time slot.

**Request Body (Example):**
```json
[
  {
    "timezone": "America/New_York",
    "start_local": "2025-09-10T09:00:00",
    "end_local": "2025-09-10T17:00:00"
  },
  {
    "timezone": "Europe/London",
    "start_local": "2025-09-10T14:00:00",
    "end_local": "2025-09-10T22:00:00"
  }
]