# Job Portal Platform

A full-stack recruitment platform connecting HR recruiters and Job Seekers. Built with Django REST Framework, React, and Docker.

## Features

### For HR Recruiters
*   **Registration & Auth**: Secure login/registration.
*   **Job Management**: Post jobs with custom requirements (salary, location, deadline).
*   **Dynamic Forms**: Create custom questionnaires for applicants.
*   **Applicant Tracking**: View applications per job.
*   **Resume Access**: View and download applicant resumes directly from the dashboard.
*   **Status Management**: Update application status (Reviewed, Rejected, Hired).

### For Job Seekers
*   **Professional Profile**: Build a comprehensive profile including:
    *   Personal Information
    *   Skills
    *   Experience
    *   Education
    *   Certifications
    *   Resume Upload
*   **Job Search**: Browse and filter available job listings.
*   **Application Tracking**: View status of all submitted applications.
*   **Easy Apply**: One-click apply using stored profile data and custom form responses.

## Tech Stack

*   **Backend**: Django, Django REST Framework, SimpleJWT
*   **Frontend**: React (Vite), Axios, React Router
*   **Database**: PostgreSQL
*   **Infrastructure**: Docker, Docker Compose

## Setup & Running

1.  **Prerequisites**: Ensure Docker and Docker Compose are installed.
2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the Application**:
    *   Frontend: [http://localhost:5173](http://localhost:5173)
    *   Backend API: [http://localhost:8000](http://localhost:8000)

## User Guide

### HR User
1.  Register as "HR".
2.  Login and go to HR Dashboard.
3.  Post a new Job.
4.  Monitor applications and download resumes.

### Job Seeker
1.  Register as "Job Seeker".
2.  Go to Profile and fill in details (Education, Experience, Certification, Resume).
3.  Go to Dashboard to find jobs.
4.  Apply to interesting roles.
5.  Check "My Applications" for updates.
