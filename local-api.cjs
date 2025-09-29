const express = require('express')
const cors = require('cors')
const { randomUUID } = require('crypto')
const sql = require('mssql')

const app = express()
const port = 7071

app.use(cors())
app.use(express.json())

const config = {
  server: 'copilot-features-sql.database.windows.net',
  database: 'copilot-features',
  user: 'copilotadmin',
  password: 'CopilotApp2024!',
  options: {
    encrypt: true,
    enableArithAbort: true
  }
}

const INITIAL_COLUMNS = `
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
  is_starred BIT NOT NULL DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
`

const ensureSchema = async (pool) => {
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[features]') AND type in (N'U'))
    BEGIN
      EXEC('CREATE TABLE dbo.features (${INITIAL_COLUMNS})')
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
    IF COL_LENGTH('dbo.features', 'is_starred') IS NULL
      ALTER TABLE dbo.features ADD is_starred BIT NOT NULL CONSTRAINT DF_features_is_starred DEFAULT 0;
  `)

  await pool.request().query(`
    UPDATE dbo.features SET tldr = '' WHERE tldr IS NULL;
    UPDATE dbo.features SET category = '' WHERE category IS NULL;
    UPDATE dbo.features SET tags = '[]' WHERE tags IS NULL;
    UPDATE dbo.features SET links = '[]' WHERE links IS NULL;
    UPDATE dbo.features SET upvotes = 0 WHERE upvotes IS NULL;
    UPDATE dbo.features SET comments = 0 WHERE comments IS NULL;
    UPDATE dbo.features SET rating = 0 WHERE rating IS NULL;
    UPDATE dbo.features SET is_starred = 0 WHERE is_starred IS NULL;
  `)
}

const safeJsonParse = (value, fallback) => {
  if (!value) return fallback
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(parsed) ? parsed : fallback
  } catch (error) {
    return fallback
  }
}

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
  isStarred: Boolean(record.is_starred),
  created_at: record.created_at,
  updated_at: record.updated_at
})

const serializeTags = (tags) => {
  if (!Array.isArray(tags)) return '[]'
  return JSON.stringify(tags.map(tag => tag.toString()))
}

const serializeLinks = (links) => {
  if (!Array.isArray(links)) return '[]'
  const normalized = links
    .filter(link => link && (link.url || link.title))
    .map(link => ({
      title: (link.title || '').toString(),
      url: (link.url || '').toString()
    }))
  return JSON.stringify(normalized)
}

const normalizeInput = (body = {}, existing = {}) => {
  const tags = body.tags ?? existing.tags ?? []
  const links = body.links ?? existing.links ?? []
  return {
    title: body.title ?? existing.title ?? '',
    date: body.date ?? existing.date ?? '',
    icon: body.icon ?? existing.icon ?? '',
    status: body.status ?? existing.status ?? '',
    description: body.description ?? existing.description ?? '',
    tldr: body.tldr ?? existing.tldr ?? '',
    category: body.category ?? existing.category ?? '',
    tags: Array.isArray(tags) ? tags : [],
    links: Array.isArray(links) ? links : [],
    image: body.image ?? existing.image ?? null,
    upvotes: body.upvotes ?? existing.upvotes ?? 0,
    comments: body.comments ?? existing.comments ?? 0,
    rating: body.rating ?? existing.rating ?? 0,
    isStarred: body.isStarred ?? existing.isStarred ?? false
  }
}

async function withDatabase(handler, res) {
  let pool
  try {
    pool = await sql.connect(config)
    await ensureSchema(pool)
    return await handler(pool)
  } catch (error) {
    console.error('Database operation failed:', error)
    if (res && !res.headersSent) {
      res.status(500).json({ error: 'Database operation failed' })
    }
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

app.get('/api/features', async (req, res) => {
  try {
    const result = await withDatabase((pool) => pool.request()
      .query('SELECT * FROM dbo.features ORDER BY created_at DESC'), res)
    res.json(result.recordset.map(mapDbFeature))
  } catch (error) {
    // handled in withDatabase
  }
})

app.post('/api/features', async (req, res) => {
  try {
    const featureInput = normalizeInput(req.body || {})
    const id = randomUUID()
    const result = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .input('title', sql.NVarChar, featureInput.title)
      .input('date', sql.NVarChar, featureInput.date)
      .input('icon', sql.NVarChar, featureInput.icon)
      .input('status', sql.NVarChar, featureInput.status)
      .input('description', sql.NVarChar, featureInput.description)
      .input('tldr', sql.NVarChar, featureInput.tldr)
      .input('category', sql.NVarChar, featureInput.category)
      .input('tags', sql.NVarChar(sql.MAX), serializeTags(featureInput.tags))
      .input('links', sql.NVarChar(sql.MAX), serializeLinks(featureInput.links))
      .input('image', sql.NVarChar(sql.MAX), featureInput.image)
      .input('upvotes', sql.Int, featureInput.upvotes)
      .input('comments', sql.Int, featureInput.comments)
      .input('rating', sql.Float, featureInput.rating)
      .input('is_starred', sql.Bit, featureInput.isStarred ? 1 : 0)
      .query(`
        INSERT INTO dbo.features (id, title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating, is_starred)
        VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @links, @image, @upvotes, @comments, @rating, @is_starred);
        SELECT * FROM dbo.features WHERE id = @id;
      `), res)
    res.status(201).json(mapDbFeature(result.recordset[0]))
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create feature' })
    }
  }
})

app.put('/api/features/:id', async (req, res) => {
  try {
    const { id } = req.params
    const existingResult = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .query('SELECT * FROM dbo.features WHERE id = @id'), res)

    if (!existingResult.recordset.length) {
      res.status(404).json({ error: 'Feature not found' })
      return
    }

    const existing = mapDbFeature(existingResult.recordset[0])
    const featureInput = normalizeInput(req.body || {}, existing)

    const result = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .input('title', sql.NVarChar, featureInput.title)
      .input('date', sql.NVarChar, featureInput.date)
      .input('icon', sql.NVarChar, featureInput.icon)
      .input('status', sql.NVarChar, featureInput.status)
      .input('description', sql.NVarChar, featureInput.description)
      .input('tldr', sql.NVarChar, featureInput.tldr)
      .input('category', sql.NVarChar, featureInput.category)
      .input('tags', sql.NVarChar(sql.MAX), serializeTags(featureInput.tags))
      .input('links', sql.NVarChar(sql.MAX), serializeLinks(featureInput.links))
      .input('image', sql.NVarChar(sql.MAX), featureInput.image)
      .input('upvotes', sql.Int, featureInput.upvotes)
      .input('comments', sql.Int, featureInput.comments)
      .input('rating', sql.Float, featureInput.rating)
      .input('is_starred', sql.Bit, featureInput.isStarred ? 1 : 0)
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
            is_starred = @is_starred,
            updated_at = GETDATE()
        WHERE id = @id;
        SELECT * FROM dbo.features WHERE id = @id;
      `), res)

    res.json(mapDbFeature(result.recordset[0]))
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to update feature' })
    }
  }
})

app.post('/api/features/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params
    const result = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .query(`
        UPDATE dbo.features
        SET upvotes = ISNULL(upvotes, 0) + 1,
            updated_at = GETDATE()
        WHERE id = @id;
        SELECT * FROM dbo.features WHERE id = @id;
      `), res)

    if (!result.recordset.length) {
      res.status(404).json({ error: 'Feature not found' })
      return
    }

    res.json(mapDbFeature(result.recordset[0]))
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to upvote feature' })
    }
  }
})

app.post('/api/features/:id/star', async (req, res) => {
  try {
    const { id } = req.params
    const isStarred = Boolean((req.body && req.body.isStarred) ?? true)
    const result = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .input('is_starred', sql.Bit, isStarred ? 1 : 0)
      .query(`
        UPDATE dbo.features
        SET is_starred = @is_starred, updated_at = GETDATE()
        WHERE id = @id;
        SELECT * FROM dbo.features WHERE id = @id;
      `), res)

    if (!result.recordset.length) {
      res.status(404).json({ error: 'Feature not found' })
      return
    }

    res.json(mapDbFeature(result.recordset[0]))
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to update feature star' })
    }
  }
})

app.delete('/api/features/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await withDatabase((pool) => pool.request()
      .input('id', sql.NVarChar, id)
      .query('DELETE FROM dbo.features WHERE id = @id'), res)

    if (!result.rowsAffected[0]) {
      res.status(404).json({ error: 'Feature not found' })
      return
    }

    res.json({ message: 'Feature deleted successfully' })
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to delete feature' })
    }
  }
})

app.listen(port, () => {
  console.log(`Local API server running on http://localhost:${port}`)
  console.log('Available endpoints:')
  console.log('  GET    /api/features')
  console.log('  POST   /api/features')
  console.log('  PUT    /api/features/:id')
  console.log('  POST   /api/features/:id/upvote')
  console.log('  POST   /api/features/:id/star')
  console.log('  DELETE /api/features/:id')
})
