# Level Up
Join us and take your productivity to the next level!

 ## Features
 - ### Login
   - Except login with account on our websit, you can also login with your Github account or Google account. 
 - ### Create tasks
   - To create a new task, simply enter the task name in the input box and press `Enter`.
 - ### Complete tasks
   - When you complete a task, click the `checkbox`, and the experience will be calculated.
 - ### Pause tasks
   - If you want to take a break, you can click the `pause` button to pause a task.
   - Please aware that you have to pause or complete the task before you leave the page, otherwise, the time won't be counted.
 - ### Delete tasks
   - To delete a task, click the `trash icon` button.
 - ### Competing with other users
   - A rank table will be shown on the right side.

 ## Setup
  - ### Env setup
    ```zsh
        # in .env.local
        POSTGRES_URL="postgres://postgres:postgres@localhost:5432/level-up"
        NEXT_PUBLIC_BASE_URL="http://localhost:3000"
        AUTH_SECRET="<Random string>"

        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Cloudinary Name>"

        AUTH_GITHUB_ID="<Github Oauth Id>"
        AUTH_GITHUB_SECRET="<Github Oauth secret>"

        AUTH_GOOGLE_ID="<Google Oauth Id>"
        AUTH_GOOGLE_SECRET="<Google Oauth secret>"
    ```
  - ### Run the server
    ```zsh
        # install dependencies
        yarn
        # run database
        docker compose up -d
        yarn migrate

        # run server
        yarn dev
    ```
