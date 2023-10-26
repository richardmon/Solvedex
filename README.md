# Application

This solution utilizes node.js, express, and prisma for the backend. SQLite serves as the database. On the frontend, the application employs React with Vite, Tailwind, and Shadcn.

To launch the application, execute the following commands:

```
chmod +x launch.sh
./launch.sh
```

Upon successful execution, the frontend will be available at `http://localhost:5173/`, and the backend will be accessible at `http://localhost:3000/`.

If you wish to inspect the database, `npx prisma studio` provides an interface for this purpose.

All CRUD operations for posts are functional. However, on the frontend, I only managed to implement the signup and login flows. I apologize for any inconvenience :^(.

Should you feel the need to reset the database, simply run `rm prisma/dev.db` and restart the application. I did not have the time to set up advanced utilities like Docker Compose, so all components will be installed directly on your machine.

Thanks for your time!.
