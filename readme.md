1. [Overview](#overview)
2. [Project architecture](#architecture)
3. [How to get this project up and running](#initialise)
4. [Notes](#notes)

   4.1. [ NATS Streaming Server](#nats)

   4.2. [ Client](#client)

   4.3. [ Payment](#payment)

   4.4. [ Define DNS](#dns)

   4.5. [ Hidden variables](#variables)

5. [How can this app be improved?](#improvements)

<a name="overview"></a>

# Overview

Hi there, you microservices enthusiast! 🤠

This is a project that was developed using as reference the [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/) course, by [Stephen Grider](https://twitter.com/ste_grider).

It is a simple e-commerce app where you can create tickets that will be available for purchase.

![tickets](./img/tickets.png)

Every purchased ticket will be available under "My orders".

![orders](./img/orders.png)

A ticket can be reserved for the duration of 15 minutes, in which case the order will have the status `awaiting payment`. If the ticket is purchased during that period, the status will get updated to `completed`. Otherwise, if the time expires, it will update to `cancelled`.

While the order for a ticket has the status `awaiting payment`, the ticket will not be visible in the Tickets table.

<a name="architecture"></a>

# Project architecture

- each microservice is held in its own [Docker](https://www.docker.com/) container
- containers orchestrated using [Kubernetes](https://kubernetes.io/)
- Kubernetes continuous development facilitated by [Skaffold](https://skaffold.dev/), which handles the workflow for building, pushing, and deploying the app
- NATS Streaming Server to establish a communication environment between microservices by means of subscription to events (messages)
- [Node](https://nodejs.dev/) on the backend side, using [Express](https://expressjs.com/) to handle the routing
- [express-validator](https://express-validator.github.io/docs/) middleware to validate the data before the request is sent
- [MongoDB](https://www.mongodb.com/) to store the data
- [mongoose](https://www.mongoose.com/) as an ODM library for MongoDB
- payments were developed using [Stripe](https://stripe.com/en-gb).
- Redis
- Queueing orders awaiting payment with [Bull](https://optimalbits.github.io/bull/)
- Testing using [Jest](https://jestjs.io/) and supertest
- the server was written using Typescript and the client Javascript

This project is comprised of 6 microservices:

| Microservice | Description                |
| ------------ | -------------------------- |
| Auth         | Handles the authentication |
| client       | Text                       |
| expiration   | Text                       |
| orders       | Text                       |
| payments     | Text                       |
| tickets      | Text                       |

It is a social network with the goal of connecting developers across the world by enabling them to:

- create their own profile
- visit other developer profiles
- add posts
- comment and like other developer posts

Some endpoints are private. That means that an authentication is required. JWT was used to accomplish this.

<a name="initialise"></a>

# How to get this project up and running

- ## Add secrets to the following containers:
  -
- Create the DNS to ticketing.dev by adding the following line to the
- run `skaffold dev` in the root directory
- Have fun!

<a name="notes"></a>

# Notes

<a name="nats"></a>

## NATS Streaming Server

- It was created, in each microservice, a file that exports a singleton of a class that allows not only the connection of the NATS streaming server but also the very client, which is returned when the connection is established, that will enable the creation of event listeners and publishers.

- A graceful shutdown was implemented in order to prevent the crushed client to stay open until the heart beat time is completed.

<a name="client"></a>

## Client

- When first connecting to the app, the following image may appear

![initial client window](./img/browser-blocker.png)

If that's the case, put the mouse focus on the image and type `thisisunsafe`.

<a name="payment"></a>

## Payment

- In order to test the application and create a successful payment use any of [these](https://stripe.com/docs/testing#cards) test card numbers when paying a ticket, a valid expiration date in the future, and any random CVC number.

<a name="dns"></a>

## Define DNS

- In order to have the site accessible in a human readable domain, we must translate the IP address to e.g. `ticketing.dev`. To do so, we must define

<a name="variables"></a>

## Hidden variable

- In order for the application to work, it is necessary to add 2 secrets that weren't published in this Github repo:

  - The JWT secret

    Execute the following command:

    ```console
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<your-key>
    ```

  - The Stripe secret key

    Login to your Stripe account and go to your [dashboard](https://dashboard.stripe.com/test/apikeys) to copy the Secret key to your clipboard. Then, execute the following command:

    ```console
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<your-key>
    ```

<a name="improvements"></a>

# How can this app be improved?

- point 1
- point 2
