<p align="center">
   <img src=".github/logo.png" width="150"/>
</p>

# Gympoint API

[![Author](https://img.shields.io/badge/author-LauraBeatris-EE4D64?style=flat-square)](https://github.com/LauraBeatris)
[![Languages](https://img.shields.io/github/languages/count/LauraBeatris/gympoint-api?color=%23EE4D64&style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/LauraBeatris/gympoint-api?color=EE4D64&style=flat-square)](https://github.com/LauraBeatris/gympoint-api/stargazers)
[![Forks](https://img.shields.io/github/forks/LauraBeatris/gympoint-api?color=%23EE4D64&style=flat-square)](https://github.com/LauraBeatris/gympoint-api/network/members)
[![Contributors](https://img.shields.io/github/contributors/LauraBeatris/gympoint-api?color=EE4D64&style=flat-square)](https://github.com/LauraBeatris/gympoint-api/graphs/contributors)

> A Rest API that helps you to manage students, enrollments, plans of a gym :rocket:

<p align="center">
  <img align="center" src="https://i.ibb.co/tM9Bynr/Web-Signin.png" alt="Web-Signin" border="0">
</p>
<br>
<p align="center">
  <img align="center" src="https://i.ibb.co/gP77Lt5/Web-Plans.png" alt="Web-Plans" border="0">
</p>
<br>

# :pushpin: Table of Contents

* [Features](#rocket-features)
* [Installation](#construction_worker-installation)
* [Getting Started](#runner-getting-started)
* [FAQ](#postbox-faq)
* [Found a bug? Missing a specific feature?](#bug-issues)
* [Contributing](#tada-contributing)
* [License](#closed_book-license)

# :rocket: Features

* Students CRUD
* Plans CRUD
* Enrollments CRUD
* Students are able to create questions related to their doubts that will be sent to instructors.

It's important to mention that this is one of the applications from the **Gympoint System**

In order to explore the others, feel free to click in the links above:
- [Gympoint Mobile](https://github.com/LauraBeatris/gympoint-mobile)
- [Gympoint Web](https://github.com/LauraBeatris/gympoint-web)

# :construction_worker: Installation

**You need to install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) first, then in order to clone the project via HTTPS, run this command:**

```git clone https://github.com/LauraBeatris/gympoiny-api.git```

SSH URLs provide access to a Git repository via SSH, a secure protocol. If you have a SSH key registered in your Github account, clone the project using this command:

```git clone git@github.com:LauraBeatris/gympoint-api.git```


# :runner: Getting Started

Run the transactions in order to configure the database schema

```npx sequelize-cli db:migrate```

Run the following command in order to start the application in a development environment:

```
 // Start the server
  yarn dev

// Run the queue responsable for the mail job
  yarn queue-dev
```

## Status Codes

Gympoint returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 422 | `UNPROCESSABLE ENTITY` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

# :postbox: Faq

**Question:** What are the tecnologies used in this project?

**Answer:** The tecnologies used in this project are [NodeJS](https://nodejs.org/en/) + [Express Framework](http://expressjs.com/en/) to handle the server and [Sequelize](https://sequelize.org/)

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the the [Gympoint API](https://github.com/LauraBeatris/gympoint-api/issues) repository. If you already found a solution to your problem, **I would love to review your pull request**! Have a look at our [contribution guidelines](https://github.com/LauraBeatris/gympoint-api/blob/master/CONTRIBUTING.md) to find out about the coding standards.

# :tada: Contributing

Check out the [contributing](https://github.com/LauraBeatris/gympoint-api/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions and begin contributing.

# :closed_book: License

Released in 2019.
This project is under the [MIT license](https://github.com/LauraBeatris/gympoint-api/master/LICENSE).

Made with love by [Laura Beatris](https://github.com/LauraBeatris) 💜🚀
