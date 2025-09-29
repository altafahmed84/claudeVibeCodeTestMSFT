const sql = require('mssql')
const { randomUUID } = require('crypto')

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
  `)

  await pool.request().query(`
    UPDATE dbo.features SET tldr = '' WHERE tldr IS NULL;
    UPDATE dbo.features SET category = '' WHERE category IS NULL;
    UPDATE dbo.features SET tags = '[]' WHERE tags IS NULL;
    UPDATE dbo.features SET links = '[]' WHERE links IS NULL;
    UPDATE dbo.features SET upvotes = 0 WHERE upvotes IS NULL;
    UPDATE dbo.features SET comments = 0 WHERE comments IS NULL;
    UPDATE dbo.features SET rating = 0 WHERE rating IS NULL;
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
    rating: body.rating ?? existing.rating ?? 0
  }
}

const applyCors = (context) => {
  context.res = context.res || {}
  context.res.headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

module.exports = async function (context, req) {
  applyCors(context)

  const method = (req.method || 'GET').toUpperCase()
  const id = req.params.id

  if (method === 'OPTIONS') {
    context.res.status = 200
    context.res.body = ''
    return
  }

  let pool
  try {
    pool = await sql.connect(config)
    await ensureSchema(pool)

    if (method === 'GET' && !id) {
      const result = await pool.request().query('SELECT * FROM dbo.features ORDER BY created_at DESC')
      context.res.status = 200
      context.res.body = result.recordset.map(mapDbFeature)
      return
    }

    if (method === 'GET' && id) {
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM dbo.features WHERE id = @id')
      if (!result.recordset.length) {
        context.res.status = 404
        context.res.body = { error: 'Feature not found' }
        return
      }
      context.res.status = 200
      context.res.body = mapDbFeature(result.recordset[0])
      return
    }

    if (method === 'POST' && !id) {
      const featureInput = normalizeInput(req.body || {})
      const newId = randomUUID()
      const result = await pool.request()
        .input('id', sql.NVarChar, newId)
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
        .query(`
          INSERT INTO dbo.features (id, title, date, icon, status, description, tldr, category, tags, links, image, upvotes, comments, rating)
          VALUES (@id, @title, @date, @icon, @status, @description, @tldr, @category, @tags, @links, @image, @upvotes, @comments, @rating);
          SELECT * FROM dbo.features WHERE id = @id;
        `)
      context.res.status = 201
      context.res.body = mapDbFeature(result.recordset[0])
      return
    }

    if (method === 'PUT' && id) {
      const existingResult = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('SELECT * FROM dbo.features WHERE id = @id')

      if (!existingResult.recordset.length) {
        context.res.status = 404
        context.res.body = { error: 'Feature not found' }
        return
      }

      const existing = mapDbFeature(existingResult.recordset[0])
      const featureInput = normalizeInput(req.body || {}, existing)

      const result = await pool.request()
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
        `)

      context.res.status = 200
      context.res.body = mapDbFeature(result.recordset[0])
      return
    }

    if (method === 'DELETE' && id) {
      const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query('DELETE FROM dbo.features WHERE id = @id')

      if (!result.rowsAffected[0]) {
        context.res.status = 404
        context.res.body = { error: 'Feature not found' }
        return
      }

      context.res.status = 200
      context.res.body = { message: 'Feature deleted successfully' }
      return
    }

    context.res.status = 405
    context.res.body = { error: 'Method not allowed' }
  } catch (error) {
    context.log.error('Features API error', error)
    context.res.status = 500
    context.res.body = { error: 'Internal server error' }
  } finally {
    if (pool) {
      try {
        await pool.close()
      } catch (closeError) {
        context.log.error('Failed to close pool', closeError)
      }
    }
  }
}
