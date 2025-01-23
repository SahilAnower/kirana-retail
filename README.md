# Retail Image Service

### To run the project, just go to the project directory, and do

`docker-compose up --build -d`

> Make sure you have running Docker desktop in local, also to run locally, you can do the following:

- `cd project_dir`
- initialize .env file with the following configurations:
  ```
    PORT=
    MONGO_URI=
    REDIS_PORT=
    REDIS_HOST=
    SERVER_ID=
  ```
- run `npm i`
- run `npm run dev`

> Things to take into considerations, if we want to scale:

- Use LB like `nginx`, or any cloud solution for this with
  multiple running instance of app servers, with LB routing them
  with any approach (eg: Round-robin).
- Have multiple queue instances of redis, to distribute the
  image processing workload across each instances of redis.
- Have multiple databases(replicas), and have some shard logic
  to each clusters.
- Have seperate processing service, to handle processing of images,
  rather than have the same over in the same server, as on what we
  are requesting apis as well.
