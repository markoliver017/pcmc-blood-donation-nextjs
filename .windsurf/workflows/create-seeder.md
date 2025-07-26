---
description: How to create a new database seeder file.
---

This workflow outlines the steps to create and run a database seeder using the Sequelize CLI.

1.  **Generate the Seeder File**

    Open a terminal and run the following command to generate a new seeder file. Replace `[name]` with a descriptive name for your seeder (e.g., `seed-feedback-questions`).

    ```bash
    npx sequelize-cli seed:generate --name [name]
    ```

2.  **Edit the Seeder File**

    Open the newly created file in the `seeders/` directory. It will have a timestamp in the filename. Add your data insertion logic within the `up` method and data deletion logic in the `down` method.

    **Example for `up` method:**

    ```javascript
    await queryInterface.bulkInsert('your_table_name', [
        { 
            column1: 'value1',
            column2: 'value2',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        // ...more data
    ], {});
    ```

    **Example for `down` method:**

    ```javascript
    await queryInterface.bulkDelete('your_table_name', null, {});
    ```

3.  **Run the Seeder**

    To populate the database with your data, run the following command:

    ```bash
    npx sequelize-cli db:seed --seed [filename-of-seeder.js]
    ```

    To run all pending seeders, you can use:

    ```bash
    npx sequelize-cli db:seed:all
    ```
