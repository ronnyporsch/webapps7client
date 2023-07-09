# Business
### Business Name
Dancetastic

### Business Description
It is a small dance studio specializing in social dances, including Salsa, Bachata, Kizomba and Zouk. We provide dance classes and parties for people of all ages and skill levels, aiming to promote the joy of dancing and artistic expression. The classes focus on building technique, musicality and the principles of leading and following. Long term the studio aims to foster a supportive community within the world of dance. 

# App
### App Name
Dancetastic Web

### App Domain Name
dancetastic.com

### App Description
The purpose of the app is to provide both students and teachers an easy access to all classes and parties that are offered by the studio. They should be able to sign up for events directly from the app. The app should have two roles for different users - teacher and student. Both of which should have different rights. For example, a teacher is able to create new events, while a student is not. The app should be backed by a database that is used to persistently save the data of users and events. 

### Domain Information Model

![Domain information model](uml/domain_information_model.png?raw=true)

### Design Information Model

![Design Information model](uml/design_information_model.png?raw=true)


### Information Management Tasks

_As an app user, I would like to..._
| # | Original | Improved |
| --- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| 1 | Enter the data of a new user: userID, name, address, birthdate | Enter the data of a new user: userID, firstName, lastName, address, birthdate |
| 2 | Assign role to user: teacher or student | Assign a role when creating the user. A user can be either a teacher or a student  |
| 3 | Update the data of a user: allow updating all data items except the userID |  Update the data of a user: allow updating all data items except the userID |
| 4 | Delete a user: remove user from the database | Delete a user |
| 5 | View all teachers: list all teachers | View all teachers: list all teachers |
| 6 | View all events: list all events and their properties | UView all events: list all events and their properties |
| 7 | View all users of an event | View all users of an event |

_As a teacher, I would like to ..._
| # | Original | Improved |
| --- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| 8 | View all users: list all users |  View all users from the database |
| 9 | Enter data for a new event: eventID, name, description, type of event (class or party), dance style, level (1-5), teacher, max number of people, day, time |Enter data for a new event: eventID, name, description, type of event (class or party), dance style, level (1-5), teacher, max number of people, datetime |
| 10 | Update data of an event: allow updating everything except the eventID | Update data of an event: allow updating everything except the eventID |
| 11 | Delete an event: remove an event from the database | Delete an event: remove an event from the database |
| 12 | Add user to an event | Add user to an event |
| 13 | Remove user from an event | Remove user from an event |


### Developer 
- @[PramitKumar27](https://github.com/PramitKumar27)
    - Assignment 7B:
        - created some issues in github
        - domain information model
    - Assignment 7C-1:
        - create use case
        - delete use case
        - generate test data
        - clear data base
    - Assignment 7C-2:
        - Redirection to Sign in/up page 
        - Email verification with customised page 
        - Implementation of 404 page
    - Assignment 7C-3:
        - Constraint Validation with Security Rules
- @[ruehsflo](https://github.com/ruehsflo)
    - Assignment 7B:
        - created some issues in github
        - design information model
    - Assignment 7C-1:
        - setting up database
        - constructor for model
        - retrieve use case
        - update use case
    - Assignment 7C-2:
        - Implementation of Sign out
        - Implementation of user authentication status
        - Enabling/disabling UI elements in start page based on authentication
    - Assignment 7C-3:
        - Data Validation
        - DB-UI synchronization