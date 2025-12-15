# BLOG API

I am building a blog and i need a backend to process some operations that is why i am building this RESTAPI,
it will use local strategy and JWT for authentication and authorization respectively, and ofcourse it will be
a posgresql database that will be managed using Prisma ORM

## ADMIN CLIENT GITHUB REPO

https://github.com/ChoforJr/admin-client-blog-api

## USER CLIENT GITHUB REPO

https://github.com/ChoforJr/user-client-blog-api

# Author : FORSAKANG CHOFOR JUNIOR

# Run the command below in your terminal to genrate a key for secret key

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the output and assign it to a secret key of your choice in your .env file
