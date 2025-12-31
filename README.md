<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Reservation Hotel</h3>
  <p align="center">
    A microservices-based hotel reservation system for searching hotels, booking rooms, and managing reservations.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project
<a href="https://github.com/Hamza-Alali-0/BudgetPlanner">
    <img src="screens/user/home/home.png" alt="Home Page" width="600">
</a>

Reservation Hotel is a distributed hotel reservation platform built as a set of Spring Boot microservices and a Vite/React frontend. The system includes services for discovery, API gateway routing, authentication, hotel data, and reservations. It supports:

- **Search & Discovery**: Browse and filter hotels by location, rating, and availability.
- **Hotel Details**: View hotel information, images, amenities, and room types.
- **Bookings**: Reserve rooms with date ranges and receive reservation confirmations.
- **User Accounts**: Sign up, sign in, and manage user reservations (via `auth-service`).
- **Admin Features**: Admin dashboard to manage hotels and reservations.
- **Microservices**: Designed to run as modular services (see `api-gateway`, `auth-service`, `eureka-server`, `hotel-service`, `reservation-service`, `frontend`).

### Built With

This project is built with the following technologies:

* [![Java][Java.com]][Java-url]
* [![Spring Boot][SpringBoot.com]][SpringBoot-url]
* [![Spring Cloud][SpringCloud.com]][SpringCloud-url]
* [![Maven][Maven.com]][Maven-url]
* [![Vite][Vite.com]][Vite-url]
* [![React][React.com]][React-url]
* [![MySQL][MySQL.com]][MySQL-url]

<!-- Reference-style links for images -->
[Java.com]: https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white
[Java-url]: https://www.java.com/
[SpringBoot.com]: https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white
[SpringBoot-url]: https://spring.io/projects/spring-boot
[SpringCloud.com]: https://img.shields.io/badge/Spring%20Cloud-6DB33F?style=for-the-badge&logo=spring&logoColor=white
[SpringCloud-url]: https://spring.io/projects/spring-cloud
[Maven.com]: https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white
[Maven-url]: https://maven.apache.org/
[Vite.com]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[React.com]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[React-url]: https://reactjs.org/
[MySQL.com]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ARCHITECTURE -->

## Architecture

The repo is organized into multiple services (each with its own `pom.xml`):

- `eureka-server` — service discovery
- `api-gateway` — routing and edge concerns
- `auth-service` — user authentication and authorization
- `hotel-service` — hotel data and search
- `reservation-service` — booking and reservation handling
- `frontend` — Vite + React single-page application

These services communicate over HTTP and register with Eureka for discovery.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SCREENSHOTS -->

## Screenshots

Here are some screenshots of the project:

| Home/Search         | Hotel Detail          | Reservation/Checkout |
| ------------------- | --------------------- | -------------------- |
| ![hotel][hotel-img] | ![hotel2][hotel2-img] | ![hotel3][hotel3-img]  |

[hotel-img]: screens/Admin/admin_dashboard.png
[hotel2-img]: screens/user/home/home2.png
[hotel3-img]: screens/user/RESERVATION2.png
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To run the project locally, follow these steps for a minimal development setup.

### Prerequisites

- Java JDK 11+
- Maven 3.6+
- Node.js + npm (for the frontend)
- MySQL (create a database and import provided SQL files where applicable)

### Installation

1. Clone the repository

```sh
git clone [<repo-url-or-local-path>](https://github.com/Hamza-Alali-0/HotelReservation.git)
```

2. Configure MySQL and import initial SQL files found in each service (for example `auth-service/init-users.sql` and `hotel-service/data.sql`).

3. Build and run backend services (from repo root):

```sh
mvn -T 1C clean install
mvn -pl eureka-server,auth-service,hotel-service,reservation-service,api-gateway spring-boot:run
```

4. Run the frontend (open a separate terminal):

```sh
cd frontend
npm install
npm run dev
```

Adjust configuration in each service's `application.yml` under `src/main/resources` for database URLs and ports if needed.

<a id="contact"></a>

## Contact

Hamza Alali - [hamza.alali.dev@gmail.com](mailto:hamza.alali.dev@gmail.com)

Connect with me:

- <a href="https://dev.to/@hamzaalali0" target="_blank"><img src="https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white" alt="Dev.to"></a>
- <a href="https://www.linkedin.com/in/hamza--alali" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
- <a href="https://github.com/hamza-alali-0" target="_blank"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
- <a href="https://www.instagram.com/alalihamza.0/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>

Project Link: [https://github.com/Hamza-Alali-0/HotelReservation.git](https://github.com/Hamza-Alali-0/HotelReservation.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
