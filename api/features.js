const { app } = require('@azure/functions');\nconst sql = require('mssql');\nconst { randomUUID } = require('crypto');

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

const initialFeatures = [
  {
    id: 'seed-gpt5',
    title: 'GPT-5',
    date: 'August 7th',
    icon: '🧠',
    status: 'General availability',
    description: 'Advanced language model capabilities with enhanced reasoning and improved safety features',
    tldr: 'Next-gen AI model with enhanced reasoning and safety',
    category: 'AI Models',
    tags: ['GPT', 'AI Model', 'General AI'],
    links: [],
    image: null,
    upvotes: 856,
    comments: 142,
    rating: 4.8
  },
  {
    id: 'seed-copilot-function',
    title: 'Copilot function =Copilot()',
    date: 'August 18th',
    icon: '📊',
    status: 'Released',
    description: 'Excel integration for AI-powered functions and data analysis',
    tldr: 'AI-powered Excel functions for data analysis',
    category: 'Copilot',
    tags: ['Excel', 'Functions', 'Data Analysis'],
    links: [],
    image: null,
    upvotes: 324,
    comments: 45,
    rating: 4.6
  },
  {
    id: 'seed-copilot-studio-m365',
    title: 'Copilot Studio Value in M365 Copilot',
    date: 'September 1st',
    icon: '🛠️',
    status: 'Released',
    description: 'Enhanced value delivery through Copilot Studio integration with Microsoft 365',
    tldr: 'Build custom AI agents with no-code Copilot Studio',
    category: 'Copilot',
    tags: ['Copilot Studio', 'No-Code', 'M365'],
    links: [],
    image: null,
    upvotes: 267,
    comments: 38,
    rating: 4.4
  },
  {
    id: 'seed-copilot-chat-m365',
    title: 'Copilot Chat in Microsoft 365 Apps',
    date: 'September 15th',
    icon: '💬',
    status: 'Released',
    description: 'AI-powered chat assistant directly integrated into Word, Excel, PowerPoint, and Outlook for seamless productivity enhancement',
    tldr: 'AI chat across all M365 apps for productivity',
    category: 'Copilot',
    tags: ['AI Assistant', 'Productivity', 'M365'],
    links: [],
    image: null,
    upvotes: 247,
    comments: 23,
    rating: 4.7
  },
  {
    id: 'seed-human-agent-teams',
    title: 'Human-agent collab in Teams',
    date: 'September 18th',
    icon: '🤝',
    status: 'Released',
    description: 'Collaborative AI agent features in Microsoft Teams for enhanced productivity',
    tldr: 'AI agents working alongside humans in Teams',
    category: 'Teams',
    tags: ['Teams', 'Collaboration', 'AI Agents'],
    links: [],
    image: null,
    upvotes: 189,
    comments: 31,
    rating: 4.3
  },
  {
    id: 'seed-role-based-ai',
    title: 'Role-based AI Solutions in M365 Copilot',
    date: 'October 10th',
    icon: '🧑‍💼',
    status: 'Released',
    description: 'Specialized AI solutions tailored for different organizational roles and workflows',
    tldr: 'Customized AI solutions for specific job roles',
    category: 'Copilot',
    tags: ['Role-based', 'Customization', 'Enterprise'],
    links: [],
    image: null,
    upvotes: 134,
    comments: 19,
    rating: 4.5
  }
];

const safeJsonParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const mapDbFeature = (record) => ({
  id: record.id,
  title: record.title,
  date: record.date,
  icon: record.icon,
  status: record.status,
  description: record.description,
  tldr: record.tldr ?? '',
  category: record.category ?? '',
  tags: safeJsonParse(record.tags, []),
  links: safeJsonParse(record.links, []),
  image: record.image,
  upvotes: record.upvotes ?? 0,
  comments: record.comments ?? 0,
  rating: record.rating ?? 0,
  created_at: record.created_at,
  updated_at: record.updated_at
});

const serializeArray = (value) => {
  if (!Array.isArray(value)) {
    return JSON.stringify([]);
  }
  return JSON.stringify(value);
};

const serializeLinks = (links) => {
  if (!Array.isArray(links)) return JSON.stringify([]);
  const normalized = links
    .filter((link) => link && (link.url || link.title))
    .map((link) => ({
      title: link.title ?? '',
      url: link.url ?? ''
    }));
  return JSON.stringify(normalized);
};

async function ensureSchema(pool) {
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[features]') AND type in (N'U'))
    BEGIN
      CREATE TABLE dbo.features (
        id NVARCHAR(36) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        date NVARCHAR(100) NOT NULL,
        icon NVARCHAR(64) NOT NULL,
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
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      );
    END;

    IF COL_LENGTH('dbo.features', 'tldr') IS NULL
      ALTER TABLE dbo.features ADD tldr NVARCHAR(300) NULL;
    IF COL_LENGTH('dbo.features', 'category') IS NULL
      ALTER TABLE dbo.features ADD category NVARCHAR(100) NULL;
    IF COL_LENGTH('dbo.features', 'tags') IS NULL
      ALTER TABLE dbo.features ADD tags NVARCHAR(MAX) NULL;
    IF COL_LENGTH('dbo.features', 'links') IS NULL
      ALTER TABLE dbo.features ADD links NVARCHAR(MAX) NULL;
    IF COL_LENGTH('dbo.features', 'image') IS NULL
      ALTER TABLE dbo.features ADD image NVARCHAR(MAX) NULL;
    IF COL_LENGTH('dbo.features', 'upvotes') IS NULL
      ALTER TABLE dbo.features ADD upvotes INT NOT NULL CONSTRAINT DF_features_upvotes DEFAULT 0;
    IF COL_LENGTH('dbo.features', 'comments') IS NULL
      ALTER TABLE dbo.features ADD comments INT NOT NULL CONSTRAINT DF_features_comments DEFAULT 0;
    IF COL_LENGTH('dbo.features', 'rating') IS NULL
      ALTER TABLE dbo.features ADD rating FLOAT NULL;
  `);

  await pool.request().query(`
    UPDATE dbo.features SET tags = '[]' WHERE tags IS NULL;
    UPDATE dbo.features SET links = '[]' WHERE links IS NULL;
    UPDATE dbo.features SET upvotes = 0 WHERE upvotes IS NULL;
    UPDATE dbo.features SET comments = 0 WHERE comments IS NULL;
    UPDATE dbo.features SET rating = 0 WHERE rating IS NULL;
  `);
}

async function initializeDatabase() {
  try {
    const pool = await sql.connect(config);
    await ensureSchema(pool);

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
        .input('tags', sql.NVarChar(sql.MAX), serializeArray(feature.tags))
        .input('links', sql.NVarChar(sql.MAX), serializeLinks(feature.links))
        .input('image', sql.NVarChar(sql.MAX), feature.image)
        .input('upvotes', sql.Int, feature.upvotes ?? 0)
        .input('comments', sql.Int, feature.comments ?? 0)
        .input('rating', sql.Float, feature.rating ?? 0)
        .query(`
          IF EXISTS (SELECT 1 FROM dbo.features WHERE id = @id)
            UPDATE dbo.features
            SET title = @title,
                date = @date,
                icon = @icon,
                status = @status,
                description = @description,
                tldr = @tldr,
                category = @category,
                tags = @tags,
                links = @links,
                image = @image,
                upvotes = @upvotes,
                comments = @comments,
                rating = @rating,
                updated_at = GETDATE()
            WHERE id = @id
          ELSE
            INSERT INTO dbo.features (id, title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating)
            VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @links, @image, @upvotes, @comments, @rating);
        `);
    }

    await pool.close();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

async function withDatabase(handler) {
  let pool
  try {
    await initializeDatabase()
    pool = await sql.connect(config)
    return await handler(pool)
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  } finally {
    if (pool) {
      try {
        await pool.close()
      } catch (closeError) {
        console.error('Failed to close database connection:', closeError)
      }
    }
  }
}

// Get all features
app.http('getFeatures', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'features',
  handler: async () => {
    try {
      const result = await withDatabase((pool) => pool.request()
        .query('SELECT * FROM dbo.features ORDER BY created_at DESC'));

      const features = result.recordset.map(mapDbFeature);
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(features)
      };
    } catch (err) {
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to fetch features' })
      };
    }
  }
});

// Create new feature
app.http('createFeature', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'features',
  handler: async (request) => {
    try {
      const body = await request.json();
      const id = body.id || randomUUID();
      const feature = {
        title: body.title,
        date: body.date,
        icon: body.icon,
        status: body.status,
        description: body.description,
        tldr: body.tldr ?? '',
        category: body.category ?? '',
        tags: body.tags ?? [],
        links: body.links ?? [],
        image: body.image ?? null,
        upvotes: body.upvotes ?? 0,
        comments: body.comments ?? 0,
        rating: body.rating ?? 0
      };

      const result = await withDatabase((pool) => pool.request()
        .input('id', sql.NVarChar, id)
        .input('title', sql.NVarChar, feature.title)
        .input('date', sql.NVarChar, feature.date)
        .input('icon', sql.NVarChar, feature.icon)
        .input('status', sql.NVarChar, feature.status)
        .input('description', sql.NVarChar, feature.description)
        .input('tldr', sql.NVarChar, feature.tldr)
        .input('category', sql.NVarChar, feature.category)
        .input('tags', sql.NVarChar(sql.MAX), serializeArray(feature.tags))
        .input('links', sql.NVarChar(sql.MAX), serializeLinks(feature.links))
        .input('image', sql.NVarChar(sql.MAX), feature.image)
        .input('upvotes', sql.Int, feature.upvotes)
        .input('comments', sql.Int, feature.comments)
        .input('rating', sql.Float, feature.rating)
        .query(`
          INSERT INTO dbo.features (id, title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating)
          VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @links, @image, @upvotes, @comments, @rating);
          SELECT * FROM dbo.features WHERE id = @id;
        `));

      const createdFeature = mapDbFeature(result.recordset[0]);
      return {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(createdFeature)
      };
    } catch (err) {
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to create feature' })
      };
    }
  }
});

// Update feature
app.http('updateFeature', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'features/{id}',
  handler: async (request) => {
    try {
      const id = request.params.id;
      const body = await request.json();
      const feature = {
        title: body.title,
        date: body.date,
        icon: body.icon,
        status: body.status,
        description: body.description,
        tldr: body.tldr ?? '',
        category: body.category ?? '',
        tags: body.tags ?? [],
        links: body.links ?? [],
        image: body.image ?? null,
        upvotes: body.upvotes ?? 0,
        comments: body.comments ?? 0,
        rating: body.rating ?? 0
      };

      const result = await withDatabase((pool) => pool.request()
        .input('id', sql.NVarChar, id)
        .input('title', sql.NVarChar, feature.title)
        .input('date', sql.NVarChar, feature.date)
        .input('icon', sql.NVarChar, feature.icon)
        .input('status', sql.NVarChar, feature.status)
        .input('description', sql.NVarChar, feature.description)
        .input('tldr', sql.NVarChar, feature.tldr)
        .input('category', sql.NVarChar, feature.category)
        .input('tags', sql.NVarChar(sql.MAX), serializeArray(feature.tags))
        .input('links', sql.NVarChar(sql.MAX), serializeLinks(feature.links))
        .input('image', sql.NVarChar(sql.MAX), feature.image)
        .input('upvotes', sql.Int, feature.upvotes)
        .input('comments', sql.Int, feature.comments)
        .input('rating', sql.Float, feature.rating)
        .query(`
          UPDATE dbo.features
          SET title = @title,
              date = @date,
              icon = @icon,
              status = @status,
              description = @description,
              tldr = @tldr,
              category = @category,
              tags = @tags,
              links = @links,
              image = @image,
              upvotes = @upvotes,
              comments = @comments,
              rating = @rating,
              updated_at = GETDATE()
          WHERE id = @id;
          SELECT * FROM dbo.features WHERE id = @id;
        `));

      if (!result.recordset.length) {
        return {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Feature not found' })
        };
      }

      const updatedFeature = mapDbFeature(result.recordset[0]);
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(updatedFeature)
      };
    } catch (err) {
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to update feature' })
      };
    }
  }
});

// Delete feature
app.http('deleteFeature', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'features/{id}',
  handler: async (request) => {
    try {
      const id = request.params.id;
      const result = await withDatabase((pool) => pool.request()
        .input('id', sql.NVarChar, id)
        .query('DELETE FROM dbo.features WHERE id = @id'));

      if (result.rowsAffected[0] === 0) {
        return {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Feature not found' })
        };
      }

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Feature deleted successfully' })
      };
    } catch (err) {
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to delete feature' })
      };
    }
  }
});

// Upvote feature
app.http('upvoteFeature', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'features/{id}/upvote',
  handler: async (request) => {
    try {
      const id = request.params.id;
      const result = await withDatabase((pool) => pool.request()
        .input('id', sql.NVarChar, id)
        .query(`
          UPDATE dbo.features
          SET upvotes = ISNULL(upvotes, 0) + 1,
              updated_at = GETDATE()
          WHERE id = @id;
          SELECT * FROM dbo.features WHERE id = @id;
        `));

      if (!result.recordset.length) {
        return {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Feature not found' })
        };
      }

      const updatedFeature = mapDbFeature(result.recordset[0]);
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(updatedFeature)
      };
    } catch (err) {
      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to upvote feature' })
      };
    }
  }
});

// Handle OPTIONS requests for CORS
app.http('optionsFeatures', {
  methods: ['OPTIONS'],
  authLevel: 'anonymous',
  route: 'features/{*restOfPath}',
  handler: async () => ({
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
});


