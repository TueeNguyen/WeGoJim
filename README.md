# How to start:

- Start `redis`:
  ```bash
  docker-compose -f docker/docker-compose.yml up --build -d
  ```
- Start server:
  ```bash
  npm run dev
  ```
- Start analyzing songs:

  ```bash
  curl -X POST localhost:8080/api/v1/rank/start
  ```

  Or to debug, use VSCode debugger

- - You can check `redis` by going to docker desktop -> redis container -> cli -> enter `redis-cli`
- - Enter `KEYS songs:*` (list of song hashes ids) or `KEYS song:*` (song hashes)
