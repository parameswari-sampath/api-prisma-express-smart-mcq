Here's a comprehensive table of all the endpoints for your MCQ system with a question bank:

| Endpoint                         | Method | Description                                  | User Role |
| -------------------------------- | ------ | -------------------------------------------- | --------- |
| /auth/register                   | POST   | Register a new user (teacher/student)        | Public    |
| /auth/login                      | POST   | Login and get JWT token                      | Public    |
| /questions                       | POST   | Create a new question in the bank            | Teacher   |
| /questions                       | GET    | Get all questions in the bank                | Teacher   |
| /questions/:id                   | GET    | Get a specific question details              | Teacher   |
| /questions/:id                   | PUT    | Update a question                            | Teacher   |
| /questions/:id                   | DELETE | Delete a question                            | Teacher   |
| /tests                           | POST   | Create a new test (with questions from bank) | Teacher   |
| /tests                           | GET    | Get all tests created by teacher             | Teacher   |
| /tests/:id                       | GET    | Get specific test details                    | Teacher   |
| /tests/:id                       | PUT    | Update test details                          | Teacher   |
| /tests/:id                       | DELETE | Delete a test                                | Teacher   |
| /tests/:id/questions             | POST   | Add questions from bank to test              | Teacher   |
| /tests/:id/questions/:questionId | DELETE | Remove a question from test                  | Teacher   |
| /tests/teacher/:id/results       | GET    | Get results of all students for a test       | Teacher   |
| /tests/available                 | GET    | Get available tests for student              | Student   |
| /tests/:id/start                 | POST   | Start a test attempt                         | Student   |
| /tests/:id/submit                | POST   | Submit test answers                          | Student   |
| /tests/student/results           | GET    | Get all personal test results                | Student   |
| /tests/student/results/:testId   | GET    | Get specific test result                     | Student   |

Would you like to adjust any of these endpoints or add additional ones?
