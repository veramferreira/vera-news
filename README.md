# Reddit Clone

This repository contains a RESTful API built using Node.js, for a Reddit-style website called Vera News which features topics, articles, comments and users. For more information on the functionality of the API, see the routes available below.

The deployed version can be viewed [here](https://vera-news.onrender.com/api).

## Setup Instructions
---

If you would like to run this project on your local machine, please clone this repository by using this link:

```
https://github.com/veramferreira/vera-news.git
```

### Prerequisites:

- node
- npm


Before start working on this project you will need to create two .env files inside the root folder, one for **test purposes** (ie: .env.test) and one for **development purposes** (ie. .env.development) using the corresponding database.

## Routes

---

### **GET /api**

Serves an HTML page with documentation for all the available endpoints


### **GET /api/topics**

Get all the topics

### **POST /api/topics/:topic_id/articles**

Add a new article to a topic. This route requires a JSON body with a title and body key and value pair e.g:

`{
  "title": "This is my article title",
  "body": "This is my article body"
}`

### **GET /api/articles**

Returns all the articles

### **GET /api/articles/:article_id**

Returns all an individual article with its comments

### **POST /api/articles/:article_id**

Add a new comment to an article. This route requires a JSON body with a message key and value pair e.g:

`{"message": "This is my new comment"}`