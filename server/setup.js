const sql = require('./db');

// Function to initialize all tables
const initTables = async () => {
  try {
    // Create Users table
    await sql`CREATE TABLE IF NOT EXISTS Users (
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Create Projects table
    await sql`CREATE TABLE IF NOT EXISTS Projects (
      project_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      owner_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Create Tasks table
    await sql`CREATE TABLE IF NOT EXISTS Tasks (
      task_id SERIAL PRIMARY KEY,
      project_id INT NOT NULL REFERENCES Projects(project_id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      priority VARCHAR(20) DEFAULT 'medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Create Comments table
    await sql`CREATE TABLE IF NOT EXISTS Comments (
      comment_id SERIAL PRIMARY KEY,
      task_id INT NOT NULL REFERENCES Tasks(task_id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Create AuditLog table
    await sql`CREATE TABLE IF NOT EXISTS AuditLog (
      log_id SERIAL PRIMARY KEY,
      table_name VARCHAR(50) NOT NULL,
      operation VARCHAR(10) NOT NULL,
      changed_by INT REFERENCES Users(user_id),
      change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      old_data JSONB,
      new_data JSONB
    )`;

    // Create function to log changes
    await sql`CREATE OR REPLACE FUNCTION log_audit_changes()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'INSERT') THEN
          INSERT INTO AuditLog (table_name, operation, changed_by, new_data)
          VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.user_id', true)::INT, row_to_json(NEW));
          RETURN NEW;
        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO AuditLog (table_name, operation, changed_by, old_data, new_data)
          VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.user_id', true)::INT, row_to_json(OLD), row_to_json(NEW));
          RETURN NEW;
        ELSIF (TG_OP = 'DELETE') THEN
          INSERT INTO AuditLog (table_name, operation, changed_by, old_data)
          VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.user_id', true)::INT, row_to_json(OLD));
          RETURN OLD;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;`;

    // Attach triggers to the tables
    const tables = ['Users', 'Projects', 'Tasks', 'Comments'];
    for (const table of tables) {
      const triggerName = `${table.toLowerCase()}_audit_trigger`;

      // Check if the trigger already exists
      const triggerExists = await sql`
        SELECT 1 FROM pg_trigger WHERE tgname = ${triggerName}
      `;

      if (triggerExists.length === 0) {
        await sql`
          CREATE TRIGGER ${sql(table.toLowerCase() + '_audit_trigger')}
          AFTER INSERT OR UPDATE OR DELETE ON ${sql(table.toLowerCase())}
          FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
        `;
      }
    }

    console.log('Tables and audit log setup initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

module.exports = { initTables, sql };
