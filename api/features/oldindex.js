const sql = require('mssql');

// Database configuration
const config = {
    server: 'copilot-features-sql.database.windows.net',
    database: 'copilot-features',
    user: 'copilotadmin',
    password: 'CopilotApp2024!',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Hardcoded features to seed the database
const initialFeatures = [
    {
        id: 'seed-gpt5',
        title: "GPT-5",
        date: "August 7th",
        icon: "🌀",
        status: "General availability",
        description: "Advanced language model capabilities with enhanced reasoning and improved safety features"
    },
    {
        id: 'seed-copilot-function',
        title: "Copilot function =Copilot()",
        date: "August 18th",
        icon: "📊",
        status: "Released",
        description: "Excel integration for AI-powered functions and data analysis"
    },
    {
        id: 'seed-human-agent-teams',
        title: "Human-agent collab in Teams",
        date: "September 18th",
        icon: "👥",
        status: "Released",
        description: "Collaborative AI agent features in Microsoft Teams for enhanced productivity"
    },
    {
        id: 'seed-copilot-studio-m365',
        title: "Copilot Studio Value in M365 Copilot",
        date: "September 1st",
        icon: "🏗️",
        status: "Released",
        description: "Enhanced value delivery through Copilot Studio integration with Microsoft 365"
    },
    {
        id: 'seed-copilot-chat-m365',
        title: "Copilot Chat in M365 Apps",
        date: "September 15th",
        icon: "💬",
        status: "Released",
        description: "Integrated chat across Word, Excel, PowerPoint, Outlook, and OneNote"
    },
    {
        id: 'seed-role-based-ai',
        title: "Role-based AI Solutions in M365 Copilot",
        date: "October 10th",
        icon: "🎯",
        status: "Released",
        description: "Specialized AI solutions tailored for different organizational roles and workflows"
    }
];

// Initialize database table and seed with hardcoded features
async function initializeDatabase() {
    try {
        const pool = await sql.connect(config);

        // Create table if it doesn't exist
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='features' AND xtype='U')
            CREATE TABLE features (
                id NVARCHAR(36) PRIMARY KEY,
                title NVARCHAR(255) NOT NULL,
                date NVARCHAR(100) NOT NULL,
                icon NVARCHAR(10) NOT NULL,
                status NVARCHAR(50) NOT NULL,
                description NVARCHAR(MAX) NOT NULL,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Seed database with hardcoded features (update if they exist, insert if they don't)
        for (const feature of initialFeatures) {
            await pool.request()
                .input('id', sql.NVarChar, feature.id)
                .input('title', sql.NVarChar, feature.title)
                .input('date', sql.NVarChar, feature.date)
                .input('icon', sql.NVarChar, feature.icon)
                .input('status', sql.NVarChar, feature.status)
                .input('description', sql.NVarChar, feature.description)
                .query(`
                    IF EXISTS (SELECT 1 FROM features WHERE id = @id)
                        UPDATE features
                        SET title = @title, date = @date, icon = @icon,
                            status = @status, description = @description,
                            updated_at = GETDATE()
                        WHERE id = @id
                    ELSE
                        INSERT INTO features (id, title, date, icon, status, description)
                        VALUES (@id, @title, @date, @icon, @status, @description)
                `);
        }

        console.log('Database initialized and seeded successfully');
        await pool.close();
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

module.exports = async function (context, req) {
    context.log('Features API function processed a request.');

    // Set CORS headers
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    const method = req.method.toUpperCase();
    const id = req.params.id;

    try {
        // Handle OPTIONS requests for CORS
        if (method === 'OPTIONS') {
            context.res.status = 200;
            context.res.body = '';
            return;
        }

        // Initialize database
        await initializeDatabase();

        if (method === 'GET' && !id) {
            // Get all features
            const pool = await sql.connect(config);
            const result = await pool.request()
                .query('SELECT * FROM features ORDER BY created_at DESC');
            await pool.close();

            context.res.status = 200;
            context.res.body = result.recordset;

        } else if (method === 'POST' && !id) {
            // Create new feature
            const { title, date, icon, status, description } = req.body;
            const newId = require('crypto').randomUUID();

            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, newId)
                .input('title', sql.NVarChar, title)
                .input('date', sql.NVarChar, date)
                .input('icon', sql.NVarChar, icon)
                .input('status', sql.NVarChar, status)
                .input('description', sql.NVarChar, description)
                .query(`
                    INSERT INTO features (id, title, date, icon, status, description)
                    VALUES (@id, @title, @date, @icon, @status, @description);
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            context.res.status = 201;
            context.res.body = result.recordset[0];

        } else if (method === 'PUT' && id) {
            // Update feature
            const { title, date, icon, status, description } = req.body;

            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .input('title', sql.NVarChar, title)
                .input('date', sql.NVarChar, date)
                .input('icon', sql.NVarChar, icon)
                .input('status', sql.NVarChar, status)
                .input('description', sql.NVarChar, description)
                .query(`
                    UPDATE features
                    SET title = @title, date = @date, icon = @icon, status = @status,
                        description = @description, updated_at = GETDATE()
                    WHERE id = @id;
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            if (result.recordset.length === 0) {
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
            } else {
                context.res.status = 200;
                context.res.body = result.recordset[0];
            }

        } else if (method === 'DELETE' && id) {
            // Delete feature
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .query('DELETE FROM features WHERE id = @id');
            await pool.close();

            if (result.rowsAffected[0] === 0) {
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
            } else {
                context.res.status = 200;
                context.res.body = { message: 'Feature deleted successfully' };
            }

        } else {
            context.res.status = 404;
            context.res.body = { error: 'Not found' };
        }

    } catch (err) {
        context.log.error('Error in features function:', err);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error' };
    }
};