# coding-project-template

In the CRUD lab you performed CRUD operations on transient data by creating API endpoints with an Express Server. In this lab, you will restrict these operations to authenticated users using JWT and session authentication.

In this lab, the friends object will be a JSON/dictionary with email as the key and friends object as the value. The friends object is a dictionary with firstName,lastName, DOB mapped to their respective values. You will thus be using “body” from the HTTP request instead of “query” and “params”.

Only authenticated users will be able to perform all the CRUD operations.

We will be testing the output of the endpoints on Postman.