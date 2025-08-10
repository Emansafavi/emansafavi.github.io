const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuration
const ADMIN_PASSWORD = 'admin123'; // Change this!
const BASE_PATH = '../'; // Path to your Jekyll site root

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(BASE_PATH, 'assets/images/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'), false);
        }
    }
});

// Authentication middleware
function authenticate(req, res, next) {
    const password = req.body.password || req.headers['x-admin-password'];
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    next();
}

// Routes

// Save a new blog post
app.post('/api/save-post', authenticate, async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const date = new Date().toISOString().split('T')[0];
        const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        const filepath = path.join(BASE_PATH, '_posts', filename);

        const postContent = `---
layout: post
title: "${title}"
date: ${date}
categories: [General]
excerpt: "Auto-generated excerpt from content"
---

${content}
`;

        await fs.writeFile(filepath, postContent);
        
        res.json({ success: true, filename });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Failed to save post' });
    }
});

// Save a new project
app.post('/api/save-project', authenticate, async (req, res) => {
    try {
        const { title, description, content, thumbnail, categories } = req.body;
        
        if (!title || !description || !content) {
            return res.status(400).json({ error: 'Title, description, and content are required' });
        }

        const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        const filepath = path.join(BASE_PATH, filename);

        const projectContent = `---
layout: empty
title: "${title}"
permalink: /${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}/
description: "${description}"
thumbnail: "${thumbnail || ''}"
categories: [${categories ? categories.split(',').map(c => c.trim()).join(', ') : ''}]
---

${content}
`;

        await fs.writeFile(filepath, projectContent);
        
        res.json({ success: true, filename });
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Upload media file
app.post('/api/upload-media', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filename = req.file.filename;
        const url = `/assets/images/${filename}`;
        const alt = req.body.alt || '';

        res.json({
            success: true,
            filename,
            url,
            alt,
            size: req.file.size
        });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// List all posts
app.get('/api/posts', authenticate, async (req, res) => {
    try {
        const postsDir = path.join(BASE_PATH, '_posts');
        const files = await fs.readdir(postsDir);
        const posts = [];

        for (const file of files) {
            if (file.endsWith('.md')) {
                const filepath = path.join(postsDir, file);
                const content = await fs.readFile(filepath, 'utf8');
                
                // Extract front matter
                const frontMatterMatch = content.match(/---\s*\n(.*?)\n---\s*\n(.*)/s);
                if (frontMatterMatch) {
                    const frontMatter = frontMatterMatch[1];
                    const body = frontMatterMatch[2];
                    
                    // Parse title
                    const titleMatch = frontMatter.match(/title:\s*"([^"]+)"/);
                    const title = titleMatch ? titleMatch[1] : file;
                    
                    // Parse date
                    const dateMatch = frontMatter.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
                    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
                    
                    posts.push({
                        filename: file,
                        title,
                        date,
                        content: body
                    });
                }
            }
        }

        res.json({ posts });
    } catch (error) {
        console.error('Error listing posts:', error);
        res.status(500).json({ error: 'Failed to list posts' });
    }
});

// List all projects
app.get('/api/projects', authenticate, async (req, res) => {
    try {
        const files = await fs.readdir(BASE_PATH);
        const projects = [];

        for (const file of files) {
            if (file.endsWith('.md') && file !== 'README.md' && file !== 'index.md') {
                const filepath = path.join(BASE_PATH, file);
                const content = await fs.readFile(filepath, 'utf8');
                
                const frontMatterMatch = content.match(/---\s*\n(.*?)\n---\s*\n(.*)/s);
                if (frontMatterMatch) {
                    const frontMatter = frontMatterMatch[1];
                    const body = frontMatterMatch[2];
                    
                    const titleMatch = frontMatter.match(/title:\s*"([^"]+)"/);
                    const title = titleMatch ? titleMatch[1] : file;
                    
                    const descMatch = frontMatter.match(/description:\s*"([^"]+)"/);
                    const description = descMatch ? descMatch[1] : '';
                    
                    const catMatch = frontMatter.match(/categories:\s*\[(.*?)\]/);
                    const categories = catMatch ? catMatch[1] : '';
                    
                    projects.push({
                        filename: file,
                        title,
                        description,
                        categories,
                        content: body
                    });
                }
            }
        }

        res.json({ projects });
    } catch (error) {
        console.error('Error listing projects:', error);
        res.status(500).json({ error: 'Failed to list projects' });
    }
});

// Delete a post
app.delete('/api/posts/:filename', authenticate, async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(BASE_PATH, '_posts', filename);
        
        await fs.unlink(filepath);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Delete a project
app.delete('/api/projects/:filename', authenticate, async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(BASE_PATH, filename);
        
        await fs.unlink(filepath);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Admin server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
