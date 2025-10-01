const sql = require('mssql');

// Database configuration
const config = {
    server: 'copilot-features-sql-1759184743.database.windows.net',
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
        icon: "🤖",
        status: "General availability",
        description: "Advanced language model capabilities with enhanced reasoning and improved safety features",
        tldr: "Next-gen AI model with enhanced reasoning and safety",
        category: "AI Models",
        tags: JSON.stringify(["GPT", "AI Model", "General AI"]),
        upvotes: 856,
        comments: 142,
        rating: 4.8,
        rating_total: 960,
        rating_count: 200,
        is_starred: 0
    },
    {
        id: 'seed-copilot-function',
        title: "Copilot function =Copilot()",
        date: "August 18th",
        icon: "📊",
        status: "Released",
        description: "Excel integration for AI-powered functions and data analysis",
        tldr: "AI-powered Excel functions for data analysis",
        category: "Copilot",
        tags: JSON.stringify(["Excel", "Functions", "Data Analysis"]),
        upvotes: 324,
        comments: 45,
        rating: 4.6,
        rating_total: 552,
        rating_count: 120,
        is_starred: 0
    },
    {
        id: 'seed-copilot-studio-m365',
        title: "Copilot Studio Value in M365 Copilot",
        date: "September 1st",
        icon: "🧩",
        status: "Released",
        description: "Enhanced value delivery through Copilot Studio integration with Microsoft 365",
        tldr: "Build custom AI agents with no-code Copilot Studio",
        category: "Copilot",
        tags: JSON.stringify(["Copilot Studio", "No-Code", "M365"]),
        upvotes: 267,
        comments: 38,
        rating: 4.4,
        rating_total: 418,
        rating_count: 95,
        is_starred: 0
    },
    {
        id: 'seed-copilot-chat-m365',
        title: "Copilot Chat in Microsoft 365 Apps",
        date: "September 15th",
        icon: "💬",
        status: "Released",
        description: "AI-powered chat assistant directly integrated into Word, Excel, PowerPoint, and Outlook for seamless productivity enhancement",
        tldr: "AI chat across all M365 apps for productivity",
        category: "Copilot",
        tags: JSON.stringify(["AI Assistant", "Productivity", "M365"]),
        upvotes: 247,
        comments: 23,
        rating: 4.7,
        rating_total: 705,
        rating_count: 150,
        is_starred: 0
    },
    {
        id: 'seed-human-agent-teams',
        title: "Human-agent collab in Teams",
        date: "September 18th",
        icon: "🤝",
        status: "Released",
        description: "Collaborative AI agent features in Microsoft Teams for enhanced productivity",
        tldr: "AI agents working alongside humans in Teams",
        category: "Teams",
        tags: JSON.stringify(["Teams", "Collaboration", "AI Agents"]),
        upvotes: 189,
        comments: 31,
        rating: 4.3,
        rating_total: 387,
        rating_count: 90,
        is_starred: 0
    },
    {
        id: 'seed-role-based-ai',
        title: "Role-based AI Solutions in M365 Copilot",
        date: "October 10th",
        icon: "🎯",
        status: "Released",
        description: "Specialized AI solutions tailored for different organizational roles and workflows",
        tldr: "Customized AI solutions for specific job roles",
        category: "Copilot",
        tags: JSON.stringify(["Role-based", "Customization", "Enterprise"]),
        upvotes: 134,
        comments: 19,
        rating: 4.5,
        rating_total: 495,
        rating_count: 110,
        is_starred: 0
    }
];


const transformRecordToFeature = (record) => {
    if (!record) {
        return null;
    }

    const rawRatingCount = Object.prototype.hasOwnProperty.call(record, 'rating_count') ? record.rating_count : (record.ratingCount ?? 0);
    const rawRatingTotal = Object.prototype.hasOwnProperty.call(record, 'rating_total') ? record.rating_total : (record.ratingTotal ?? 0);
    const ratingCount = Number.isFinite(rawRatingCount) ? rawRatingCount : Number(rawRatingCount) || 0;
    const ratingTotal = Number.isFinite(rawRatingTotal) ? rawRatingTotal : Number(rawRatingTotal) || 0;
    const baseRating = Number.isFinite(record.rating) ? record.rating : Number(record.rating) || 0;
    const averageRating = ratingCount > 0 ? ratingTotal / ratingCount : baseRating;

    const parseMaybeJson = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        try {
            return JSON.parse(value);
        } catch {
            return [];
        }
    };

    const sanitizeIcon = (value) => {
        if (typeof value !== 'string') return '🤖';
        const trimmed = value.trim();
        if (!trimmed) return '🤖';
        if (/^\?+$/.test(trimmed)) return '🤖';
        return trimmed;
    };

    const icon = sanitizeIcon(record.icon);

    return {
        id: record.id,
        title: record.title,
        date: record.date,
        icon,
        status: record.status,
        description: record.description,
        tldr: record.tldr || '',
        category: record.category || '',
        tags: parseMaybeJson(record.tags),
        links: parseMaybeJson(record.links),
        image: record.image,
        upvotes: record.upvotes || 0,
        comments: record.comments || 0,
        rating: averageRating || 0,
        ratingCount,
        ratingTotal,
        isStarred: Boolean(record.is_starred ?? record.isStarred),
        created_at: record.created_at,
        updated_at: record.updated_at
    };
};

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
                tldr NVARCHAR(300) NULL,
                category NVARCHAR(100) NULL,
                tags NVARCHAR(MAX) NULL,
                links NVARCHAR(MAX) NULL,
                image NVARCHAR(MAX) NULL,
                upvotes INT NOT NULL DEFAULT 0,
                comments INT NOT NULL DEFAULT 0,
                rating FLOAT NULL,
                rating_total FLOAT NOT NULL DEFAULT 0,
                rating_count INT NOT NULL DEFAULT 0,
                is_starred BIT NOT NULL DEFAULT 0,
                created_at DATETIME2 DEFAULT GETDATE(),
                updated_at DATETIME2 DEFAULT GETDATE()
            )
        `);

        // Ensure rating aggregation columns exist before seeding
        await pool.request().query(`
            IF COL_LENGTH('features', 'rating_total') IS NULL
                ALTER TABLE features ADD rating_total FLOAT NOT NULL DEFAULT 0;
            IF COL_LENGTH('features', 'rating_count') IS NULL
                ALTER TABLE features ADD rating_count INT NOT NULL DEFAULT 0;
        `);

        await pool.request().query(`
            UPDATE features
            SET
                rating_total = CASE
                    WHEN (rating_total IS NULL OR rating_total = 0) AND (rating IS NOT NULL AND rating > 0) THEN rating
                    WHEN rating_total IS NULL THEN 0
                    ELSE rating_total
                END,
                rating_count = CASE
                    WHEN (rating_count IS NULL OR rating_count = 0) AND (rating IS NOT NULL AND rating > 0) THEN 1
                    WHEN rating_count IS NULL THEN 0
                    ELSE rating_count
                END;
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
                .input('tldr', sql.NVarChar, feature.tldr)
                .input('category', sql.NVarChar, feature.category)
                .input('tags', sql.NVarChar, feature.tags)
                .input('upvotes', sql.Int, feature.upvotes)
                .input('comments', sql.Int, feature.comments)
                .input('rating', sql.Float, feature.rating)
                .input('rating_total', sql.Float, feature.rating_total)
                .input('rating_count', sql.Int, feature.rating_count)
                .input('is_starred', sql.Bit, feature.is_starred)
                .query(`
                    IF EXISTS (SELECT 1 FROM features WHERE id = @id)
                        UPDATE features
                        SET title = @title, date = @date, icon = @icon,
                            status = @status, description = @description, tldr = @tldr,
                            category = @category, tags = @tags, upvotes = @upvotes,
                            comments = @comments, rating = @rating, rating_total = @rating_total,
                            rating_count = @rating_count, is_starred = @is_starred,
                            updated_at = GETDATE()
                        WHERE id = @id
                    ELSE
                        INSERT INTO features (id, title, date, icon, status, description, tldr, category, tags, upvotes, comments, rating, rating_total, rating_count, is_starred)
                        VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @upvotes, @comments, @rating, @rating_total, @rating_count, @is_starred)
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
    const action = req.params.action;

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

            // Transform database results to match frontend expectations
            const features = result.recordset
                .map(transformRecordToFeature)
                .filter(Boolean);

            context.res.status = 200;
            context.res.body = features;

        } else if (method === 'POST' && !id) {
            // Create new feature
            const { title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating, isStarred } = req.body;
            const newId = require('crypto').randomUUID();

            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, newId)
                .input('title', sql.NVarChar, title)
                .input('date', sql.NVarChar, date)
                .input('icon', sql.NVarChar, icon)
                .input('status', sql.NVarChar, status)
                .input('description', sql.NVarChar, description)
                .input('tldr', sql.NVarChar, tldr || '')
                .input('category', sql.NVarChar, category || '')
                .input('tags', sql.NVarChar, JSON.stringify(tags || []))
                .input('links', sql.NVarChar, JSON.stringify(links || []))
                .input('image', sql.NVarChar, image)
                .input('upvotes', sql.Int, upvotes || 0)
                .input('comments', sql.Int, comments || 0)
                .input('rating', sql.Float, rating || 0)
                .input('rating_total', sql.Float, rating || 0)
                .input('rating_count', sql.Int, rating ? 1 : 0)
                .input('is_starred', sql.Bit, isStarred ? 1 : 0)
                .query(`
                    INSERT INTO features (id, title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating, rating_total, rating_count, is_starred)
                    VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @links, @image, @upvotes, @comments, @rating, @rating_total, @rating_count, @is_starred);
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            const newFeature = transformRecordToFeature(result.recordset[0]);

            context.res.status = 201;
            context.res.body = newFeature;

        } else if (method === 'PUT' && id && action === 'upvote') {
            // Handle upvote
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .query(`
                    UPDATE features SET upvotes = upvotes + 1, updated_at = GETDATE() WHERE id = @id;
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            if (result.recordset.length === 0) {
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
            } else {
                const updatedFeature = transformRecordToFeature(result.recordset[0]);
                context.res.status = 200;
                context.res.body = updatedFeature;
            }

        } else if (method === 'PUT' && id && action === 'star') {
            // Handle star toggle
            const { isStarred } = req.body;
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .input('is_starred', sql.Bit, isStarred ? 1 : 0)
                .query(`
                    UPDATE features SET is_starred = @is_starred, updated_at = GETDATE() WHERE id = @id;
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            if (result.recordset.length === 0) {
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
            } else {
                const updatedFeature = transformRecordToFeature(result.recordset[0]);
                context.res.status = 200;
                context.res.body = updatedFeature;
            }

        } else if (method === 'PUT' && id && action === 'rating') {
            // Handle rating submission
            const { rating, previousRating = 0 } = req.body || {};
            const ratingValue = Number(rating);
            const previousValue = Number(previousRating);

            if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                context.res.status = 400;
                context.res.body = { error: 'Rating must be between 1 and 5' };
                return;
            }

            const normalizedPrevious = Number.isFinite(previousValue) && previousValue >= 1 && previousValue <= 5
                ? previousValue
                : 0;

            const pool = await sql.connect(config);
            const existing = await pool.request()
                .input('id', sql.NVarChar, id)
                .query('SELECT rating_total, rating_count FROM features WHERE id = @id;');

            if (!existing.recordset.length) {
                await pool.close();
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
                return;
            }

            let ratingTotal = Number(existing.recordset[0].rating_total || 0);
            let ratingCount = Number(existing.recordset[0].rating_count || 0);

            if (normalizedPrevious > 0) {
                ratingTotal = ratingTotal - normalizedPrevious + ratingValue;
                if (ratingCount <= 0) {
                    ratingCount = 1;
                }
            } else {
                ratingTotal += ratingValue;
                ratingCount += 1;
            }

            ratingTotal = Math.max(0, ratingTotal);
            ratingCount = Math.max(0, ratingCount);

            const average = ratingCount > 0 ? ratingTotal / ratingCount : 0;

            await pool.request()
                .input('id', sql.NVarChar, id)
                .input('rating_total', sql.Float, ratingTotal)
                .input('rating_count', sql.Int, ratingCount)
                .input('rating', sql.Float, average)
                .query(`
                    UPDATE features
                    SET rating_total = @rating_total,
                        rating_count = @rating_count,
                        rating = @rating,
                        updated_at = GETDATE()
                    WHERE id = @id;
                `);

            const updated = await pool.request()
                .input('id', sql.NVarChar, id)
                .query('SELECT * FROM features WHERE id = @id;');
            await pool.close();

            const updatedFeature = transformRecordToFeature(updated.recordset[0]);
            context.res.status = 200;
            context.res.body = updatedFeature;

        } else if (method === 'PUT' && id) {
            // Update feature
            const normalizeNumeric = (value) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : undefined;
            };
            const ratingTotalInput = normalizeNumeric(req.body?.rating_total) ?? normalizeNumeric(req.body?.ratingTotal);
            const ratingCountInput = normalizeNumeric(req.body?.rating_count) ?? normalizeNumeric(req.body?.ratingCount);
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .input('title', sql.NVarChar, title)
                .input('date', sql.NVarChar, date)
                .input('icon', sql.NVarChar, icon)
                .input('status', sql.NVarChar, status)
                .input('description', sql.NVarChar, description)
                .input('tldr', sql.NVarChar, tldr || '')
                .input('category', sql.NVarChar, category || '')
                .input('tags', sql.NVarChar, JSON.stringify(tags || []))
                .input('links', sql.NVarChar, JSON.stringify(links || []))
                .input('image', sql.NVarChar, image)
                .input('upvotes', sql.Int, upvotes || 0)
                .input('comments', sql.Int, comments || 0)
                .input('rating', sql.Float, rating || 0)
                .input('rating_total', sql.Float, ratingTotalInput ?? (rating || 0))
                .input('rating_count', sql.Int, ratingCountInput ?? (rating ? 1 : 0))
                .input('is_starred', sql.Bit, isStarred ? 1 : 0)
                .query(`
                    UPDATE features
                    SET title = @title, date = @date, icon = @icon, status = @status,
                        description = @description, tldr = @tldr, category = @category,
                        tags = @tags, links = @links, image = @image, upvotes = @upvotes,
                        comments = @comments, rating = @rating, rating_total = @rating_total,
                        rating_count = @rating_count, is_starred = @is_starred,
                        updated_at = GETDATE()
                    WHERE id = @id;
                    SELECT * FROM features WHERE id = @id;
                `);
            await pool.close();

            if (result.recordset.length === 0) {
                context.res.status = 404;
                context.res.body = { error: 'Feature not found' };
            } else {
                const updatedFeature = transformRecordToFeature(result.recordset[0]);
                context.res.status = 200;
                context.res.body = updatedFeature;
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
