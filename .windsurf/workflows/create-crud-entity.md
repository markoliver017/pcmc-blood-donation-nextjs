---
description: A step-by-step guide to create a new CRUD entity in the PCMC Blood Donation App.
---

# Workflow: Create a New CRUD Entity

This workflow outlines the process for adding a new data entity (e.g., "Supplies", "Equipment") with full CRUD (Create, Read, Update, Delete) functionality.

Replace `[EntityName]` (e.g., `Supply`) and `[entityName]` (e.g., `supply`) throughout this guide.

### 1. Create the Sequelize Model File

-   **Location**: `lib/models/`
-   **Action**: Create a new file named `[EntityName]Model.js`.
-   **Content**: Create a function that defines and returns the Sequelize model, following the existing pattern in `lib/models/UserModel.js`. Include an `associate` method for defining relationships.

    ```javascript
    const [EntityName]Model = (sequelize, DataTypes) => {
        const [EntityName] = sequelize.define(
            "[entityName]",
            {
                // ... define columns
            }
        );

        [EntityName].associate = (models) => {
            // ... define associations here
        };

        return [EntityName];
    };

    export default [EntityName]Model;
    ```

### 2. Register the New Model

-   **Location**: `lib/models/index.js`
-   **Action**: Import the new model file and initialize it.
-   **Details**:
    1.  Add the import statement with the other model imports:
        `import [EntityName]Model from "./[EntityName]Model.js";`
    2.  Add the model initialization with the others:
        `const [EntityName] = [EntityName]Model(sequelize, DataTypes);`
    3.  Add the new model to the `db` object.
    4.  Add the model to the final `export` statement.

### 3. Create the Zod Validation Schema

-   **Location**: `lib/zod/`
-   **Action**: Create a new file named `[entityName]Schema.js`.
-   **Content**: Export Zod schemas for creating and updating the entity (e.g., `create[EntityName]Schema`, `update[EntityName]Schema`).

### 4. Implement Server Actions

-   **Location**: `app/action/`
-   **Action**: Create a new file named `[entityName]Action.js`.
-   **Content**: Implement and export `"use server"` functions for `create[EntityName]`, `get[EntityName]`, `update[EntityName]`, and `delete[EntityName]`.

### 5. Develop the UI Components

-   **Location**: `components/[entityName]/`
-   **Action**: Create the necessary React components for the entity's UI.
-   **Examples**:
    -   `Create[EntityName]Form.jsx`: A client component (`"use client"`) with a form managed by React Hook Form.
    -   `[EntityName]DataTable.jsx`: A component to display a list of entities, likely using TanStack Table.
    -   `Edit[EntityName]Page.jsx`: A page or component containing the form for updates.

### 6. Create the Page Routes

-   **Location**: `app/(pages)/portal/(role_based)/admin/` (or another appropriate role)
-   **Action**: Create a new route directory for managing the entity (e.g., `/[entityName]/`).
-   **Content**: Add `page.jsx` files to display the data table and forms.