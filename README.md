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

### **GET /api/articles**

Returns all the articles

### **GET /api/articles/:article_id**

Returns all an individual article with its comments

### **GET /api/articles/:article_id/comments/**

Returns an array of comments for the requested article

### **POST /api/articles/:article_id/comments**

Adds a new comment to the requested article and responds with the posted comment e.g:

`{ posted: 
{"username": "butter_bridge",
"body": "I carry a log — yes. Is it funny to you? It is not to me."}
}`

### **PATCH /api/articles/:article_id**
Updates the requested article's vote count based on the value included in the body. 
e.g. { inc_votes : 1 } would increment the current article's vote property by 1, { inc_votes : -100 } would decrement the current article's vote property by 100. It returns the updated article.