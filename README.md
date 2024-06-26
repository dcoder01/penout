# Penup

A simple blog application built with Express, MongoDB, EJS, and Bootstrap.

## Features
- Create, read, update, and delete blog posts
- Users can comment on a particular post and provide feedback to the author
- Responsive design using Bootstrap
- Partials in EJS for reusable components
- Users can show the blogs of the other users by clicking on his profile
- Logged in users can update their profile photos under the profile section.
## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/dcoder01/penup.git
    ```
2. Navigate to the project directory:
    ```sh
    cd penup
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Create a `.env` file in the root directory and add the following variables:
    ```
    MONGO_URL=mongodb://localhost:27017/penout
    PORT=3001
    ```
5. Start the application:
    ```sh
    npm start
    ```

## Usage
1. Open your browser and go to `http://localhost:3001`.
2. You can now create, edit, delete, and comment on blog posts.




## License
This project is licensed under the MIT License.
