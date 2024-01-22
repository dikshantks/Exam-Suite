### Examination Suite

#### Features

#### Admin

- Register/login to access test related information
- Create test of a given category
- View results of each student & examine their tests

#### User(Students)

- Take tests by entering Name, Email & Pin(given by admin)
- Cannot take tests after its expiry
- The test will auto-submit when the time expiries
- Can take each test only once

#### Additional

- Refresh of the test will continue from the same state
- Random shuffling of options

## Project Setup Guide

### Prerequisites

- Node.js: Make sure you have Node.js installed on your machine. You can download it from the official website: [Node.js](https://nodejs.org)

- Git: If you are using Windows, make sure you have Git installed on your machine. You can download it from the official website: [Git](https://git-scm.com/download/win).
- Alternatively, you can download the ZIP file of the repository by clicking on the "Code" button and selecting "Download ZIP".

### Installation Steps

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project root directory:

   ```bash
   cd project-directory
   ```

3. Install dependencies for both the client and server:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

4. Rename the `.env.example` file to `.env`:

   ```bash
   mv .env.example .env
   ```

5. Start the project:

   ```bash
   cd ../client
   npm run start

   cd ../server
   npm run start
   ```

6. Open your browser and visit `http://localhost:3000` to access the application.

### Additional Steps

- If you encounter any issues during the setup process, please refer to the project's documentation or reach out to the project maintainers for assistance.
- Make sure to configure the necessary environment variables in the `.env` file before running the project.
- Remember to run the client and server in separate terminal windows or tabs.
