# (Group 28) [Level Up!](https://level-up-gules.vercel.app)

### Introduction:
Level Up is a productivity app that allows you to "level up" based on the time you spent focusing on the task. As you immerse yourself in your work, the app tracks your dedicated time, transforming your daily routine into a rewarding journey of accomplishment. The unique leveling system adds a gamified element to your productivity, turning each task into a quest to overcome. This approach not only encourages sustained focus but also provides a tangible representation of your progress, making the entire work experience more engaging and fulfilling. With Level Up, we hope that productivity becomes more than just a routine, and becomes a personalized and motivating adventure towards achieving your goals.

### Features:
 - #### Credentials and OAuth2 Logging In
   Seamlessly access our application by either creating a dedicated account or using your Google or Github credentials.
 - #### Task management
    Effortlessly manage your tasks with Level Up's comprehensive features:
    - Create Task:
        Simply enter the task name in the input box and press Enter to create a new task instantly.
    - Delete Task:
        Streamline your task list by easily deleting completed or unnecessary tasks with a simple click.
    - Time Your Task:
        Enhance productivity with dedicated timers for each task. Measure and visualize the time you invest in short bursts or extended deep-dive sessions, providing insights for efficient time management
- #### Time-Centric Progression
    Level Up introduces a gamified approach to productivity. Earn experience points and advance through levels based on the time dedicated to your tasks, transforming work into an engaging and rewarding experience.
 - #### Achievements and Rewards
    Elevate your achievements with a dynamic system of rewards that celebrate your milestones. Whether you excel in completing tasks within set timeframes or consistently achieve high productivity levels, Level Up acknowledges your dedication. Unlock ranks and titles that reflect your commitment, providing a motivating acknowledgment of your success. Strive for excellence and let Level Up be your companion on the journey to success.
 - #### Competing with others
   View a dynamic table of rankings on the right side of the application. Harness the power of friendly competition to boost productivity and inspire users to achieve new heights.

### Known bugs:
- Can't handle login error accordingly due to [NextAuth v5 signIn function bug](https://github.com/nextauthjs/next-auth/issues/9279)

### Setting up our app on localhost:
Create a .env.local file with the following content:
  - ### .env.local setup in the root directory
    ```zsh
        # database string (docker)
        POSTGRES_URL=<database string>
	# base url of the app
        NEXT_PUBLIC_BASE_URL=http://localhost:3000
	# next-cloudinary cloud name (just use ours' for testing purpose)
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<...>
	# auth related
	AUTH_SECRET=<Random string>
        AUTH_GITHUB_ID=<Github Oauth Id>
        AUTH_GITHUB_SECRET=<Github Oauth secret>
        AUTH_GOOGLE_ID=<Google Oauth Id>
        AUTH_GOOGLE_SECRET=<Google Oauth secret>
    ```
  - ### Running the app
    ```zsh
        # install dependencies
        yarn
        # setup database
        docker compose up -d
        yarn migrate
        # run server
        yarn 
    ```

### Third-Party Packages utilized:
- #### Auth Related:
    - [NextAuth v5](https://authjs.dev/): Handles user authentication
    - BcryptJs: Manages password processing
- #### Frontend:
    - [Mantine](https://mantine.dev/): React component library
    - [Mantine UI](https://ui.mantine.dev/): Provides several UI components
    - [hello-pangea/dnd](https://github.com/hello-pangea/dnd): Enables Drag and Drop functionality
    - [Tabler Icons](https://tabler.io/icons/): Offers a collection of icons
    - [Next Cloudinary](https://next.cloudinary.dev/): Facilitates image uploading
- #### Backend:
    - Axios: Used for sending requests to API endpoints
    - [Drizzle ORM](https://orm.drizzle.team/): TypeScript ORM for the Postgres database

### Project Reflections/Insights:
- #### B11106011 歐益劭:
- #### B11106031 施宥丞:
### Responsibilities of Each Team Member:
- #### B11106011 歐益劭:
- #### B11106031 施宥丞:
