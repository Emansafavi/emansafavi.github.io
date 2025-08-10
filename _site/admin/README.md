# Jekyll Admin Panel

A password-protected admin interface for managing your Jekyll website content without touching code.

## Features

- 🔐 **Password Protection** - Secure access to your admin panel
- ✍️ **Markdown Editor** - Rich text editing with CodeMirror
- 📝 **Post Management** - Create, edit, and delete blog posts
- 🎨 **Project Management** - Manage your portfolio projects
- 📸 **Media Library** - Upload and manage images and videos
- 👀 **Live Preview** - See your content as it will appear
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Theme Support** - Matches your site's design

## Setup Instructions

### 1. File Structure

Place the admin files in your Jekyll site root:

```
your-jekyll-site/
├── admin/
│   ├── index.html
│   ├── admin.css
│   ├── admin.js
│   ├── save-content.php (optional)
│   └── README.md
├── _posts/
├── _layouts/
├── assets/
└── ...
```

### 2. Password Configuration

**Important:** Change the default password in `admin.js`:

```javascript
// In admin.js, line 4
this.password = 'your-secure-password-here'; // Change this!
```

### 3. Access the Admin Panel

Navigate to: `https://yourdomain.com/admin/`

### 4. Backend Setup (Optional)

For full functionality, you can use the PHP backend:

1. Ensure your server supports PHP
2. Upload `save-content.php` to your server
3. Update the password in `save-content.php` to match your admin.js password
4. The admin panel will automatically use the backend for file operations

## Usage Guide

### Creating a New Post

1. Login to the admin panel
2. Click "Posts" in the navigation
3. Click "New Post"
4. Enter the post title
5. Write your content in Markdown format
6. Use the toolbar for formatting (Bold, Italic, Links, Images, etc.)
7. Switch to "Preview" tab to see how it looks
8. Click "Save Post"

### Creating a New Project

1. Click "Projects" in the navigation
2. Click "New Project"
3. Fill in:
   - **Title**: Project name
   - **Description**: Brief project description
   - **Content**: Full project content in Markdown
   - **Thumbnail**: Image URL for the project
   - **Categories**: Comma-separated categories
4. Click "Save Project"

### Managing Media

1. Click "Media" in the navigation
2. Click "Upload Media"
3. Select an image or video file
4. Add alt text for accessibility
5. Click "Upload"

## Markdown Features

The editor supports standard Markdown syntax:

### Text Formatting
- `**bold**` → **bold**
- `*italic*` → *italic*
- `[link text](url)` → [link text](url)

### Headers
- `# Header 1`
- `## Header 2`
- `### Header 3`

### Media
- `![alt text](image-url)` → Image
- `<video controls><source src="video-url"></video>` → Video

### Code
- `` `inline code` `` → `inline code`
- ``` ```code block``` ``` → Code block

### Quotes
- `> Quote text` → Blockquote

## Security Considerations

1. **Change the default password** immediately
2. **Use HTTPS** for secure transmission
3. **Consider IP restrictions** for additional security
4. **Regular backups** of your content
5. **Monitor access logs** for suspicious activity

## Customization

### Styling
Edit `admin.css` to match your site's design:
- Colors and fonts
- Layout and spacing
- Button styles
- Modal appearance

### Functionality
Modify `admin.js` to:
- Add new content types
- Customize the editor
- Add validation rules
- Integrate with external services

### Backend
Extend `save-content.php` to:
- Add more file operations
- Implement user management
- Add content validation
- Connect to databases

## Troubleshooting

### Common Issues

**Admin panel not loading:**
- Check file paths are correct
- Ensure all files are uploaded
- Check browser console for errors

**Can't save content:**
- Verify PHP is enabled (if using backend)
- Check file permissions
- Ensure directories are writable

**Images not uploading:**
- Check upload directory exists
- Verify file permissions
- Check file size limits

### File Permissions

Ensure these directories are writable:
- `_posts/` (for blog posts)
- `assets/images/` (for media uploads)
- Root directory (for project files)

## Advanced Features

### Custom Post Types
Add new content types by extending the admin panel:

1. Add new navigation button
2. Create editor interface
3. Implement save functionality
4. Add to backend processing

### External Integrations
Connect to external services:

- **GitHub API** - Auto-commit changes
- **Cloud Storage** - Store media files
- **CDN** - Serve optimized images
- **Analytics** - Track admin usage

### Workflow Automation
Automate common tasks:

- Auto-generate excerpts
- Optimize images on upload
- Create social media previews
- Schedule post publishing

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Verify file permissions
4. Test with minimal content

## License

This admin panel is provided as-is for educational and personal use. Modify as needed for your specific requirements.
