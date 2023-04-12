const sql = require('mssql/msnodesqlv8');
const express = require('express');

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Configure middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure database connection settings
const config = {
  database: 'Level_UP_Reservation',
  server: 'LAPTOP-F1DLTNIK\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  },
};

app.get('/Customer', async (req, res) => {
  try {
    const getCustomer = async () => {
      try {
        let pool = await sql.connect(config);
        let Customer = pool.request().query('SELECT * FROM Customers');
        console.log(Customer);
        return Customer;
      } catch (error) {
        console.log(error);
      }
    };
    getCustomer().then((res) => {
      console.log(res.recordset);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Customer', async (req, res) => {
  const customer = req.body;
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `INSERT INTO Customers VALUES (${customer.customer_id},'${customer.first_name}','${customer.last_name}','${customer.date_of_birth}','${customer.email}','${customer.phone_number}','${customer.customer_status}',${customer.fees_outstanding},'${customer.date_became_customer}')`
      );
    console.log(result);
    class Customers {
      constructor(
        customer_id,
        first_name,
        last_name,
        date_of_birth,
        email,
        phone_number,
        customer_status,
        fees_outstanding,
        date_became_customer
      ) {
        this.customer_id = customer_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.email = email;
        this.phone_number = phone_number;
        this.customer_status = customer_status;
        this.fees_outstanding = fees_outstanding;
        this.date_became_customer = date_became_customer;
      }
    }
    const newCustomers = new Customers(
      customer.customer_id,
      customer.first_name,
      customer.last_name,
      customer.date_of_birth,
      customer.email,
      customer.phone_number,
      customer.customer_status,
      customer.fees_outstanding,
      customer.date_became_customer
    );
    console.log(newCustomers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/Classes', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Classes_yoga');

    console.log(result.recordset);
    let classes = result.recordset;

    let html = `
      <html>
        <head>
          <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          
          h1 {
            margin-top: 50px;
            color: #333;
            font-size: 36px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
          }
          
          ul {
            margin: 30px auto;
            padding: 0;
            list-style: none;
            text-align: center;
          }
          
          li {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          }
          
          li:nth-child(odd) {
            background-color: #f5f5f5;
          }
          
          label {
            display: block;
            margin-top: 20px;
            margin-bottom: 5px;
            color: #555;
            font-size: 16px;
            font-weight: bold;
          }
          
          select,
          input[type='text'],
          input[type='date'],
          input[type='time'],
          input[type='number'] {
            display: block;
            width: 70%;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: #f5f5f5;
            color: #333;
            font-size: 16px;
            font-weight: normal;
            margin: 0 auto 10px auto;
          }
          
          select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path fill="%23333" d="M0 0l6 8 6-8z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 12px;
          }
          
          select::-ms-expand {
            display: none;
          }
          
          button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            border: none;
            background-color: #333;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
          }
          
          button:hover {
            background-color: #555;
          }
          
          #other_teacher {
            display: none;
          }
          
          </style>
        </head>
        <body>
          <h1>List of Yoga Classes</h1>
          <ul>
    `;

    classes.forEach((classItem) => {
      html += `
        <li>${classItem.class_id}</li>
        <ul>
          <li>date: ${classItem.class_date}</li>
          <li>Duration: ${classItem.class_time}</li>
          <li>price: ${classItem.class_price}</li>
          <li>Level: ${classItem.class_level}</li>
          <li>instructor: ${classItem.teacher}</li>
        </ul>
      `;
    });

    html += `
          </ul>
          <form method="POST" action="/Classes/add">
            <label for="new_class_id">New Class ID:</label>
            <input type="text" name="new_class_id" id="new_class_id"><br><br>
            <label for="teacher">Teacher:</label>
            <select name="teacher" id="teacher_select">
    `;

    classes.forEach((classItem) => {
      html += `
        <option value="${classItem.teacher}">${classItem.teacher}</option>
      `;
    });

    html += `
            <option value="Other">Other</option>
            </select><br><br>
            <div id="other_teacher" style="display: none;">
              <label for="other_teacher_name">Other Teacher:</label>
              <input type="text" name="other_teacher_name" id="other_teacher_name"><br><br>
            </div>
            <label for="class_date">Date:</label>
            <input type="date" name="class_date" id="class_date"><br><br>
            <label for="class_time">Time:</label>
            <input type="time" name="class_time" id="class_time"><br><br>
            <label for="class_price">Price:</label>
            <input type="number" name="class_price" id="class_price"><br><br>
            <label for="class_level">Level:</label>
            <input type="text" name="class_level" id="class_level"><br><br>
            <button type="submit">Add to Schedule</button>
          </form>
          <script>
            const teacherSelect = document.getElementById('teacher_select');
            const otherTeacherDiv = document.getElementById('other_teacher');
            teacherSelect.addEventListener('change', (event) => {
              if (event.target.value === 'Other') {
                otherTeacherDiv.style.display = 'block'; // Show the "Other Teacher" input field when "Other" is selected
              } else {
                otherTeacherDiv.style.display = 'none'; // Hide the "Other Teacher" input field when another teacher is selected
              }
            });
          </script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.post('/Classes/add', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let classId = req.body.new_class_id;
    let teacher = req.body.teacher;
    if (teacher === 'Other') {
      teacher = req.body.other_teacher_name;
    }
    let classDate = req.body.class_date;
    let classTime = req.body.class_time;
    let classPrice = req.body.class_price;
    let classLevel = req.body.class_level;
    await pool
      .request()
      .input('classId', sql.VarChar(10), classId)
      .input('teacher', sql.VarChar(50), teacher)
      .input('classDate', sql.Date, classDate)
      .input('classTime', sql.Time, classTime)
      .input('classPrice', sql.Decimal(10, 2), classPrice)
      .input('classLevel', sql.VarChar(20), classLevel)
      .query(
        `INSERT INTO Classes_yoga (class_id, teacher, class_date, class_time, class_price, class_level)
     VALUES (@classId, @teacher, @classDate, @classTime, @classPrice, @classLevel)`
      );

    res.redirect('/Classes');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/Payments', async (req, res) => {
  try {
    const getPayment = async () => {
      try {
        let pool = await sql.connect(config);
        let Payment = pool.request().query('SELECT * FROM Payments_yoga');
        console.log(Payment);
        return Payment;
      } catch (error) {
        console.log(error);
      }
    };
    getPayment().then((result) => {
      console.log(result.recordset);

      // Generate HTML for displaying Payments
      let html = `
        <html>
          <head>
            <style>
              /* CSS for table display */
              table {
                margin: 20px auto;
                border-collapse: collapse;
                width: 80%;
              }
              th,
              td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
              }
              tr:hover {
                background-color: #f5f5f5;
              }
              th {
                background-color: #333;
                color: white;
              }
              /* CSS for form display */
              form {
                margin: 20px auto;
                width: 80%;
                display: flex;
                flex-direction: column;
              }
              input {
                margin-bottom: 10px;
                padding: 5px;
                border-radius: 5px;
                border: none;
              }
              button {
                padding: 10px;
                border-radius: 5px;
                border: none;
                background-color: #333;
                color: white;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>List of Payments</h1>
            <table>
              <tr>
                <th>Payment ID</th>
                <th>Payment Method</th>
                <th>Payment Date</th>
                <th>Payment Amount</th>
              </tr>
      `;

      result.recordset.forEach((row) => {
        html += `
          <tr>
            <td><a href="/Payments/${row.payment_id}">${row.payment_id}</a></td>
            <td>${row.payment_method}</td>
            <td>${row.payment_date}</td>
            <td>${row.payment_amount}</td>
          </tr>
        `;
      });

      html += `
            </table>
            <h2>Add a new payment</h2>
            <form action="/Payments" method="post">
              <input type="number" name="payment_id" placeholder="Payment ID">
              <input type="text" name="payment_method" placeholder="Payment Method">
              <input type="date" name="payment_date" placeholder="Payment Date">
              <input type="number" name="payment_amount" placeholder="Payment Amount">
              <button type="submit">Add Payment</button>
            </form>
          </body>
        </html>
      `;
      res.send(html);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Payments', async (req, res) => {
  const payment = req.body;
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `INSERT INTO Payments_yoga VALUES (${payment.payment_id},'${payment.payment_method}','${payment.payment_date}',${payment.payment_amount})`
      );
    console.log(result);
    class Payments {
      constructor(payment_id, payment_method, payment_date, payment_amount) {
        this.payment_id = payment_id;
        this.payment_method = payment_method;
        this.payment_date = payment_date;
        this.payment_amount = payment_amount;
      }
    }
    const newPayment = new Payments(
      payment.payment_id,
      payment.payment_method,
      payment.payment_date,
      payment.payment_amount
    );
    console.log(newPayment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/Reservations', async (req, res) => {
  try {
    const getReservations = async () => {
      try {
        let pool = await sql.connect(config);
        let reservations = pool
          .request()
          .query('SELECT * FROM Reservations_yoga');
        console.log(reservations);
        return reservations;
      } catch (error) {
        console.log(error);
      }
    };
    getReservations().then((result) => {
      console.log(result.recordset);

      // Generate HTML for displaying Reservations
      let html = `
        <html>
          <head>
            <style>
              /* CSS for table display */
              table {
                margin: 20px auto;
                border-collapse: collapse;
                width: 80%;
              }
              th,
              td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;
              }
              tr:hover {
                background-color: #f5f5f5;
              }
              th {
                background-color: #333;
                color: white;
              }
              /* CSS for form display */
              form {
                margin: 20px auto;
                width: 80%;
                display: flex;
                flex-direction: column;
              }
              input {
                margin-bottom: 10px;
                padding: 5px;
                border-radius: 5px;
                border: none;
              }
              button {
                padding: 10px;
                border-radius: 5px;
                border: none;
                background-color: #333;
                color: white;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>List of Reservations</h1>
            <table>
              <tr>
                <th>Reservation ID</th>
                <th>Customer ID</th>
                <th>Class ID</th>
                <th>Lesson Status Code</th>
                <th>Payment ID</th>
              </tr>
      `;

      result.recordset.forEach((row) => {
        html += `
          <tr>
            <td><a href="/Reservations/${row.reservation_id}">${row.reservation_id}</a></td>
            <td>${row.customer_id}</td>
            <td>${row.class_id}</td>
            <td>${row.lesson_status_code}</td>
            <td>${row.payment_id}</td>
          </tr>
        `;
      });

      html += `
            </table>
            <h2>Add a new reservation</h2>
            <form action="/Reservations" method="post">
              <input type="number" name="reservation_id" placeholder="Reservation ID">
              <input type="number" name="customer_id" placeholder="Customer ID">
              <input type="number" name="class_id" placeholder="Class ID">
              <select name="lesson_status_code">
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="In Progress">In Progress</option>
              </select>
              <input type="number" name="payment_id" placeholder="Payment ID">
              <button type="submit">Add Reservation</button>
            </form>
          </body>
        </html>
      `;
      res.send(html);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Reservations', async (req, res) => {
  const reservation = req.body;
  try {
    let pool = await sql.connect(config);

    // Insert reservation into Reservations table
    await pool
      .request()
      .input('reservation_id', sql.Int, reservation.reservation_id)
      .input('customer_id', sql.Int, reservation.customer_id)
      .input('class_id', sql.Int, reservation.class_id)
      .input(
        'lesson_status_code',
        sql.VarChar(20),
        reservation.lesson_status_code
      )
      .input('payment_id', sql.Int, reservation.payment_id)
      .query(
        `INSERT INTO Reservations_yoga (reservation_id, customer_id, class_id, lesson_status_code, payment_id)
         VALUES (@reservation_id, @customer_id, @class_id, @lesson_status_code, @payment_id)`
      );

    // Redirect to Reservations page
    res.redirect('/Reservations');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
