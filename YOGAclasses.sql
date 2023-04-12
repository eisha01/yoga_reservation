CREATE DATABASE Level_UP_Reservation;

USE Level_UP_Reservation;


CREATE TABLE Customers (
    customer_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    customer_status VARCHAR(10) NOT NULL CHECK (customer_status IN ('New', 'Regular')),
    fees_outstanding DECIMAL(10, 2) DEFAULT 0.00,
    date_became_customer DATE NOT NULL,
    CONSTRAINT PK_Customers PRIMARY KEY (customer_id)
);

CREATE TABLE Classes_yoga (
    class_id INT NOT NULL PRIMARY KEY,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    class_price DECIMAL(10, 2) NOT NULL,
    class_level VARCHAR(20) NOT NULL CHECK (class_level IN ('Beginner', 'Intermediate', 'Advanced')),
    teacher VARCHAR(100) NOT NULL
);

CREATE TABLE Payments_yoga (
    payment_id INT NOT NULL PRIMARY KEY,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Credit Card', 'Cash')),
    payment_date DATETIME NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Reservations_yoga (
    reservation_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    class_id INT NOT NULL,
    lesson_status_code VARCHAR(20) NOT NULL CHECK (lesson_status_code IN ('Completed', 'Cancelled', 'In Progress')),
    payment_id INT NOT NULL,
    CONSTRAINT FK_Reservations_Customers_yoga FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    CONSTRAINT FK_Reservations_Classes_yoga FOREIGN KEY (class_id) REFERENCES Classes_yoga(class_id),
    CONSTRAINT FK_Reservations_Payments_yoga FOREIGN KEY (payment_id) REFERENCES Payments(payment_id)
);

INSERT INTO Customers (customer_id, first_name, last_name, date_of_birth, email, phone_number, customer_status, fees_outstanding, date_became_customer)
VALUES (1, 'John', 'Doe', '1990-01-01', 'john.doe@example.com', '1234567890', 'New', 0.00, '2020-01-01');

INSERT INTO Classes_yoga(class_id,class_date, class_time, class_price, class_level, teacher)
VALUES (1,'2023-04-01', '13:00:00', 50.00, 'Beginner', 'John Doe'),
       (2,'2023-04-02', '16:00:00', 60.00, 'Intermediate', 'Jane Smith'),
       (3,'2023-04-03', '18:00:00', 70.00, 'Advanced', 'Bob Johnson');

INSERT INTO Payments_yoga(payment_id,payment_method, payment_date, payment_amount)
VALUES (1,'Credit Card', '2023-03-30 12:34:56', 100.50),
       (2,'Cash', '2023-03-29 08:45:12', 75.20),
       (3,'Credit Card', '2023-03-27 14:56:34', 55.80),
       (4,'Cash', '2023-03-26 16:28:00', 120.00);

INSERT INTO Reservations_yoga(reservation_id, customer_id, class_id, lesson_status_code, payment_id)
VALUES (2, 1, 1, 'Completed',1)

UPDATE Customers
SET customer_status = 'Regular'
WHERE customer_id = 1;


DELETE FROM Customers
WHERE customer_id = 1;

select * from Customers

select * from Classes_yoga

select * from Payments_yoga

select * from Reservations_yoga






