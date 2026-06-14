# 🎓 CampusConnect – College Buy & Sell Marketplace

A simple web-based marketplace for college students to buy and sell products within their campus.

---

## 📋 Features

- ✅ User Registration & Login
- ✅ Post Items for Sale (with category)
- ✅ Search & Filter Listings by keyword and category
- ✅ View Seller Contact Details
- ✅ Edit / Delete your own listings
- ✅ User Profile Management

---

## 🛠️ Tech Stack

| Layer    | Technology      |
|----------|-----------------|
| Frontend | HTML, CSS, JS   |
| Backend  | Spring Boot     |
| Database | MySQL           |

---

## ⚙️ Setup Instructions

### Step 1 – MySQL Setup

Open MySQL and run:

```sql
CREATE DATABASE campusconnect_db;
```

> The tables will be created automatically by Spring Boot when you start the app.

---

### Step 2 – Configure Database Password

Open this file:
```
src/main/resources/application.properties
```

Update your MySQL username and password:

```properties
spring.datasource.username=root
spring.datasource.password=your_password_here
```

---

### Step 3 – Run the Application

Make sure you have **Java 17+** and **Maven** installed.

```bash
./mvnw spring-boot:run
```

OR open the project in IntelliJ IDEA and click the Run button.

---

### Step 4 – Open in Browser

Go to:
```
http://localhost:8081
```

The app will redirect you to the login page.

---

## 📁 Project Structure

```
campusconnect/
├── src/
│   ├── main/
│   │   ├── java/com/example/campusconnect/
│   │   │   ├── CampusConnectApplication.java
│   │   │   ├── auth/
│   │   │   │   ├── User.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── UserController.java
│   │   │   └── listing/
│   │   │       ├── Listing.java
│   │   │       ├── ListingRepository.java
│   │   │       └── ListingController.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           ├── index.html        ← Login / Signup
│   │           ├── marketplace.html  ← Browse listings
│   │           ├── post.html         ← Post new item
│   │           ├── mylistings.html   ← My listings
│   │           ├── profile.html      ← User profile
│   │           ├── auth.js
│   │           ├── app.js
│   │           ├── post.js
│   │           ├── mylistings.js
│   │           ├── profile.js
│   │           └── style.css
└── pom.xml
```

---

## 🔑 API Endpoints

### Users
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/users/signup | Register new user |
| POST | /api/users/login | Login user |
| GET | /api/users/profile/{id} | Get profile |
| PUT | /api/users/profile/{id} | Update profile |

### Listings
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/listings | Get all listings |
| GET | /api/listings?keyword=book&category=Books | Search & filter |
| GET | /api/listings/user/{sellerId} | Get my listings |
| POST | /api/listings | Create listing |
| PUT | /api/listings/{id} | Update listing |
| DELETE | /api/listings/{id}?sellerId=1 | Delete listing |

---

Made with ❤️ as a college project.
