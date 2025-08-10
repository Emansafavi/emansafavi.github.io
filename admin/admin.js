// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.password = 'admin123'; // Change this to your desired password
        this.isAuthenticated = false;
        this.currentPost = null;
        this.currentProject = null;
        this.editor = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadContent();
    }

    checkAuth() {
        const savedAuth = localStorage.getItem('adminAuth');
        if (savedAuth === 'true') {
            this.isAuthenticated = true;
            this.showAdminPanel();
        }
    }

    bindEvents() {
        // Login
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Post management
        document.getElementById('new-post-btn').addEventListener('click', () => {
            this.newPost();
        });

        document.getElementById('save-post').addEventListener('click', () => {
            this.savePost();
        });

        document.getElementById('cancel-post').addEventListener('click', () => {
            this.cancelPost();
        });

        // Project management
        document.getElementById('new-project-btn').addEventListener('click', () => {
            this.newProject();
        });

        document.getElementById('save-project').addEventListener('click', () => {
            this.saveProject();
        });

        document.getElementById('cancel-project').addEventListener('click', () => {
            this.cancelProject();
        });

        // Media management
        document.getElementById('upload-media-btn').addEventListener('click', () => {
            this.showUploadModal();
        });

        document.getElementById('upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadMedia();
        });

        document.getElementById('cancel-upload').addEventListener('click', () => {
            this.hideUploadModal();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Toolbar actions
        document.querySelectorAll('.toolbar button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toolbarAction(e.target.dataset.action);
            });
        });
    }

    login() {
        const password = document.getElementById('password').value;
        if (password === this.password) {
            this.isAuthenticated = true;
            localStorage.setItem('adminAuth', 'true');
            this.showAdminPanel();
        } else {
            alert('Incorrect password');
        }
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('adminAuth');
        this.showLoginScreen();
    }

    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'flex';
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');

        // Update preview if needed
        if (tab === 'preview') {
            this.updatePreview();
        }
    }

    loadContent() {
        this.loadPosts();
        this.loadProjects();
        this.loadMedia();
    }

    loadPosts() {
        // This would typically fetch from your Jekyll _posts directory
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '<p>Loading posts...</p>';
        
        // For demo purposes, show sample posts
        setTimeout(() => {
            postsList.innerHTML = `
                <div class="post-item">
                    <div class="post-info">
                        <div class="post-title">Sample Post 1</div>
                        <div class="post-date">2025-01-15</div>
                    </div>
                    <div class="post-actions">
                        <button class="action-btn edit-btn" onclick="admin.editPost('post1')">Edit</button>
                        <button class="action-btn delete-btn" onclick="admin.deletePost('post1')">Delete</button>
                    </div>
                </div>
            `;
        }, 500);
    }

    loadProjects() {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '<p>Loading projects...</p>';
        
        setTimeout(() => {
            projectsList.innerHTML = `
                <div class="project-item">
                    <div class="project-info">
                        <div class="project-title">Sample Project 1</div>
                        <div class="project-categories">Music, Installation</div>
                    </div>
                    <div class="project-actions">
                        <button class="action-btn edit-btn" onclick="admin.editProject('project1')">Edit</button>
                        <button class="action-btn delete-btn" onclick="admin.deleteProject('project1')">Delete</button>
                    </div>
                </div>
            `;
        }, 500);
    }

    loadMedia() {
        const mediaGrid = document.getElementById('media-grid');
        mediaGrid.innerHTML = '<p>Loading media...</p>';
        
        setTimeout(() => {
            mediaGrid.innerHTML = `
                <div class="media-item">
                    <img src="https://via.placeholder.com/200x150" alt="Sample image">
                    <div class="media-item-info">
                        <div class="media-item-title">sample-image.jpg</div>
                        <div class="media-item-size">245 KB</div>
                    </div>
                </div>
            `;
        }, 500);
    }

    newPost() {
        this.currentPost = null;
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('post-editor').style.display = 'block';
        this.initEditor();
    }

    editPost(postId) {
        this.currentPost = postId;
        // Load post data (in real implementation, fetch from server)
        document.getElementById('post-title').value = 'Sample Post Title';
        document.getElementById('post-content').value = '# Sample Post\n\nThis is a sample post content.';
        document.getElementById('post-editor').style.display = 'block';
        this.initEditor();
    }

    savePost() {
        const title = document.getElementById('post-title').value;
        const content = this.editor ? this.editor.getValue() : document.getElementById('post-content').value;
        
        if (!title || !content) {
            alert('Please fill in all fields');
            return;
        }

        // Generate Jekyll post file content
        const postContent = this.generatePostFile(title, content);
        
        // In a real implementation, this would save to your Jekyll _posts directory
        console.log('Saving post:', postContent);
        
        // For demo purposes, show success message
        alert('Post saved successfully!');
        this.cancelPost();
        this.loadPosts();
    }

    generatePostFile(title, content) {
        const date = new Date().toISOString().split('T')[0];
        const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        
        return `---
layout: post
title: "${title}"
date: ${date}
categories: [General]
excerpt: "Auto-generated excerpt from content"
---

${content}
`;
    }

    cancelPost() {
        document.getElementById('post-editor').style.display = 'none';
        this.currentPost = null;
    }

    newProject() {
        this.currentProject = null;
        document.getElementById('project-title').value = '';
        document.getElementById('project-description').value = '';
        document.getElementById('project-content').value = '';
        document.getElementById('project-thumbnail').value = '';
        document.getElementById('project-categories').value = '';
        document.getElementById('project-editor').style.display = 'block';
    }

    editProject(projectId) {
        this.currentProject = projectId;
        // Load project data
        document.getElementById('project-title').value = 'Sample Project';
        document.getElementById('project-description').value = 'A sample project description';
        document.getElementById('project-content').value = '# Sample Project\n\nProject content here.';
        document.getElementById('project-thumbnail').value = 'https://via.placeholder.com/300x200';
        document.getElementById('project-categories').value = 'Music, Installation';
        document.getElementById('project-editor').style.display = 'block';
    }

    saveProject() {
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const content = document.getElementById('project-content').value;
        const thumbnail = document.getElementById('project-thumbnail').value;
        const categories = document.getElementById('project-categories').value;
        
        if (!title || !description || !content) {
            alert('Please fill in all required fields');
            return;
        }

        // Generate project file content
        const projectContent = this.generateProjectFile(title, description, content, thumbnail, categories);
        
        console.log('Saving project:', projectContent);
        alert('Project saved successfully!');
        this.cancelProject();
        this.loadProjects();
    }

    generateProjectFile(title, description, content, thumbnail, categories) {
        const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        
        return `---
layout: empty
title: "${title}"
permalink: /${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}/
description: "${description}"
thumbnail: "${thumbnail}"
categories: [${categories.split(',').map(c => c.trim()).join(', ')}]
---

${content}
`;
    }

    cancelProject() {
        document.getElementById('project-editor').style.display = 'none';
        this.currentProject = null;
    }

    showUploadModal() {
        document.getElementById('upload-modal').style.display = 'flex';
    }

    hideUploadModal() {
        document.getElementById('upload-modal').style.display = 'none';
        document.getElementById('upload-form').reset();
    }

    uploadMedia() {
        const file = document.getElementById('media-file').files[0];
        const alt = document.getElementById('media-alt').value;
        
        if (!file) {
            alert('Please select a file');
            return;
        }

        // In a real implementation, this would upload to your assets directory
        console.log('Uploading file:', file.name, 'Alt text:', alt);
        
        alert('Media uploaded successfully!');
        this.hideUploadModal();
        this.loadMedia();
    }

    initEditor() {
        if (this.editor) {
            this.editor.toTextArea();
        }
        
        this.editor = CodeMirror.fromTextArea(document.getElementById('post-content'), {
            mode: 'markdown',
            theme: 'monokai',
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            }
        });
    }

    updatePreview() {
        const content = this.editor ? this.editor.getValue() : document.getElementById('post-content').value;
        const preview = document.getElementById('preview-content');
        
        // Simple markdown to HTML conversion (in production, use a proper markdown parser)
        const html = this.markdownToHtml(content);
        preview.innerHTML = html;
    }

    markdownToHtml(markdown) {
        // Basic markdown to HTML conversion
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1">')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/\n/gim, '<br>');
    }

    toolbarAction(action) {
        if (!this.editor) return;
        
        const doc = this.editor.getDoc();
        const cursor = doc.getCursor();
        const selection = doc.getSelection();
        
        let replacement = '';
        
        switch (action) {
            case 'bold':
                replacement = `**${selection || 'bold text'}**`;
                break;
            case 'italic':
                replacement = `*${selection || 'italic text'}*`;
                break;
            case 'link':
                replacement = `[${selection || 'link text'}](url)`;
                break;
            case 'image':
                replacement = `![${selection || 'alt text'}](image-url)`;
                break;
            case 'video':
                replacement = `<video controls>\n  <source src="video-url" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`;
                break;
            case 'code':
                replacement = `\`${selection || 'code'}\``;
                break;
            case 'quote':
                replacement = `> ${selection || 'quote text'}`;
                break;
        }
        
        doc.replaceSelection(replacement);
        this.editor.focus();
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            console.log('Deleting post:', postId);
            alert('Post deleted successfully!');
            this.loadPosts();
        }
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            console.log('Deleting project:', projectId);
            alert('Project deleted successfully!');
            this.loadProjects();
        }
    }
}

// Initialize admin panel
const admin = new AdminPanel();
